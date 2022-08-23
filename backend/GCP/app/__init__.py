# -*- coding: UTF-8 -*-
import app.model as model
import numpy as np

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/test', methods=['GET'])
def getResult():
    input = np.array([[50,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0]])
    result = model.predict(input)
    return jsonify({'result': str(result)})


@app.route('/predict', methods=['POST'])
def postInput():
    # 取得前端傳過來的數值
    insertValues = request.get_json()
    x1=insertValues['charge']
    x2=insertValues['gender']
    x3=insertValues['senior']
    x4=insertValues['partner']
    x5=insertValues['depen']
    x6=insertValues['phone']
    x7=insertValues['multiline']
    x8=insertValues['fiber']
    x9=insertValues['noInternet']
    x10=insertValues['security']
    x11=insertValues['backup']
    x12=insertValues['protection']
    x13=insertValues['support']
    x14=insertValues['tv']
    x15=insertValues['movie']
    x16=insertValues['year1']
    x17=insertValues['year2']
    x18=insertValues['paper']
    x19=insertValues['credit']
    x20=insertValues['elect']
    x21=insertValues['mail']
    
    input = np.array([[x1, x2, x3, x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14,x15,x16,x17,x18,x19,x20,x21]])
    # 進行預測
    result = model.predict(input)

    return jsonify({'result': str(result)})
