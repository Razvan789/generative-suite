from flask import Flask, request, send_from_directory
from flask_cors import CORS
import json
import os
import base64
import torch
import uuid
from PIL import Image, ImageOps
from diffusers import StableDiffusionPipeline
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.environ.get('OPENAPI_KEY')

baseUrl = "http://localhost:5000/"
imagesUrl = "Images/"
transformUrl = imagesUrl + "transformed/"
generatedUrl = imagesUrl + "generated/"
uploadUrl = imagesUrl + "uploads/"
extendedUrl = imagesUrl + "extended/"
model_id = "CompVis/stable-diffusion-v1-4"
device = "cuda"

# Pretained model Citation
# Citation:
# @InProceedings{Rombach_2022_CVPR,
#     author    = {Rombach, Robin and Blattmann, Andreas and Lorenz, Dominik and Esser, Patrick and Ommer, Bj\"orn},
#     title     = {High-Resolution Image Synthesis With Latent Diffusion Models},
#     booktitle = {Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
#     month     = {June},
#     year      = {2022},
#     pages     = {10684-10695}
# }

pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe = pipe.to(device)

# prompt = "japanese Cyberpunk cityscape, 2048 Hyperrealism"
# image = pipe(prompt).images[0]  
    
# image.save("NewImage.png")



app = Flask(__name__)
CORS(app)
# Hack to get around setting up a database
if(not os.environ.get('CURRENT_COUNT')):
    os.environ['CURRENT_COUNT'] = '0'

@app.route("/")
def Ping():
    return "<p>Server is running</p>", 200

imageCount = 0
@app.route("/image", methods=['POST', 'DELETE'])
def image():
    if request.method == 'POST':
        app.logger.info('image POST endpoint was reached')
        #Used to select what transform to apply to the image (if any)
        img = uploadImg(request.files['image'])
        if(request.form):
            transform = request.form['transform']
            app.logger.info(f"Transform selected: {transform}")
            #If Transparent Border is selected
            if(transform == "transparentBorder"):   
                transparentImg = addTransparentBorder(img[0]['imgUrl'])
                return transparentImg
        return img
    elif request.method == 'DELETE':
        return deleteImg(request)


def uploadImg(img):
    filename = uuid.uuid4().hex + ".png"
    #Convert to base64
    if img:
        img.save(os.path.join(uploadUrl, filename))
        app.logger.info('File was saved to: ' + filename)
        return {
            "message": "File was uploaded",
            "status": "success",
            "imgUrl": baseUrl + uploadUrl + filename,
        }, 200
    else:
        return {
            "message": "No file was uploaded"
        }, 400



@app.route("/image/edit", methods=['POST'])
def editImage():
    #Used to select what transform to apply to the image (if any)
    transform = request.json['transform']
    imgUrl = request.json['imgUrl']
    app.logger.info(f"Editing Image with Url: {imgUrl}")
    #If Transparent Border is selected
    if(transform == "transparentBorder"):
        transparentImg = addTransparentBorder(imgUrl)
        return transparentImg
    if(transform == "extend"):
        if(request.json['prompt']):
            extendedImage = extendImage(imgUrl, request.json['prompt'])
            return extendedImage
        #no prompt is provided
        return {"message": "No prompt was provided", "status": "unsuccessful",}, 400;    
    
    # If no transform is selected
    return {
        "message": "Image not edited",
        "imgUrl": imgUrl,
        "status": "unsuccessful",

    }, 418;


def deleteImg(request):
    imgUrl = request.json['imgUrl']
    #remove the baseUrl from the storedName
    imgUrl = imgUrl.replace(baseUrl, "")
    app.logger.info('Deleting Image from: ' + imgUrl)
    if os.path.exists(imgUrl):
        os.remove(imgUrl)
        return {
            "message": "File was deleted"
        }, 200;
    else:
        return {
            "message": "No file was deleted"
        }, 400;



@app.route("/generate/image", methods=['GET'])
def generateImage():
    prompt = request.args.get('prompt')
    engine = request.args.get('engine')
    app.logger.info(f"Generating Image with Prompt: {prompt} using Engine: {engine}")
    if(engine == "OpenAI"):
        return generateImageOpenAPI(prompt)
    else:
        return generateImageDiffuser(prompt)


def generateImageDiffuser(prompt):
    image = pipe(prompt).images[0] 
    storedName = uuid.uuid4().hex + ".png" 
    image.save(generatedUrl + storedName)
    return {
        "message": "Image was generated",
        "storedName": storedName,
        "status": "success",
        "imgUrl": baseUrl + generatedUrl + storedName

    }, 200;

def generateImageOpenAPI(prompt):
    # Call the OpenAPI DALL-E model
    response = openai.Image.create(
        prompt=prompt,
        response_format="b64_json",
        user="createImageBackend",
        size="512x512"
    )
    print("Saving Image")
    base64Iimg = response['data'][0]['b64_json']
    filename = uuid.uuid4().hex + ".png"
    writeBase64ToDisk(base64Iimg, generatedUrl + filename)
    return {
        "message": "Image was generated",
        "status": "success",
        "imgUrl": baseUrl + generatedUrl + filename

    }, 200;



def addTransparentBorder(imgUrl):
    # Clean imgUrl
    imgUrl = imgUrl.replace(baseUrl, "")
    #Get the image name
    imgName = imgUrl.split("/")[-1]
    app.logger.info(f"Adding Transparent Border to Image: {imgName}")
    #Open Image
    img = Image.open(imgUrl)
    img = img.convert("RGBA")
    #Add The Transparent Border
    img = ImageOps.expand(img,border=(200,200,200,200),fill=(0,0,0,0))
    
    #Save the image
    img.save(transformUrl + imgName, "PNG")
    app.logger.info(f"Image saved to: {transformUrl + imgUrl}")
    return {
        "message": "Transparent Border was added",
        "status": "success",
        "transformedImgUrl": baseUrl + transformUrl + imgName,
        "imgUrl": baseUrl + imgUrl
    }, 200;


def extendImage(imgUrl, prompt):
    #add the transparent border
    newImgUrl = addTransparentBorder(imgUrl)[0]['transformedImgUrl']
    app.logger.info(f"Extending Image: {newImgUrl} with Prompt: {prompt}")
    filename = newImgUrl.split("/")[-1]
    #Clean imgUrl
    newImgUrl = newImgUrl.replace(baseUrl, "")
    # Call the OpenAPI DALL-E model
    response = openai.Image.create_edit(
        image=open(newImgUrl, "rb"),
        prompt=prompt,
        response_format="b64_json",
        user="extendImageBackend"
    )
    print("Saving Image")

    base64Iimg = response['data'][0]['b64_json']
    writeBase64ToDisk(base64Iimg, extendedUrl + filename)
    #Save the image
    # image.save(extendedUrl + filename)
    return {
        "message": "Image was generated",
        "status": "success",
        "imgUrl": baseUrl + imgUrl + filename,
        "transformedImgUrl": baseUrl + extendedUrl + filename,
    }, 200;



def writeBase64ToDisk(base64Iimg, filepath):
    #Decode and write the base64
    with open(filepath, "wb") as fh:
        fh.write(base64.b64decode(base64Iimg))

# Serve images 
@app.route('/Images/<path:filename>')
def download_file(filename):
    print("FileName:", filename)
    return send_from_directory('Images', filename)

@app.route('/openAPI/test', methods=['GET'])
def openAPI():
    print(openai.Model.list())
    return {
        "message": "OpenAPI was called",
        "status": "success",
    }, 200;
