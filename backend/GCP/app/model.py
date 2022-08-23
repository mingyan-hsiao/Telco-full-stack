# -*- coding: UTF-8 -*-
import pickle
import gzip

# 載入Model
with gzip.open('app/model/glm_model.pgz', 'r') as f:
    logiModel = pickle.load(f)


def predict(input):
    pred=logiModel.predict(input)[0]
    print(pred)
    return pred