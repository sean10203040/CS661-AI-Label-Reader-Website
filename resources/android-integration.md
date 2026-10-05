# Final best.pt exported using the original notebook method

Use **best.tflite** from this directory. It was made from the selected final checkpoint, SHA256 `28cc3f0970f44530451508290867ff4e654837ad11fb3c8227f57caf93f7d4c2`, using the same export method as your original notebook. Ultralytics 8.4.171 redirects TFLite export to LiteRT. This is a float32 model of 12,255,975 bytes.

```python
from ultralytics import YOLO
best_model = YOLO("selected_best.pt")
tflite_path = best_model.export(format="tflite", imgsz=640)
print(tflite_path)
```

## Android contract

- Input: **float32 [1, 3, 640, 640]**, NCHW. Orient the camera photo, letterbox it to 640×640 without stretching, pad RGB 114, and normalize RGB values by dividing by 255. In a flat input buffer, write the entire red plane, then green, then blue. This is not interleaved NHWC. Input bytes: 4,915,200; use native byte order for float ByteBuffers.
- Output: **float32 [1, 5, 8400]**, channel-major. Channels: normalized center-x, center-y, width, height, `product_name` probability. In a flat output buffer, channel c and candidate i are at c*8400+i. Output bytes: 168,000. No separate objectness channel or extra sigmoid.
- Multiply normalized x/y/width/height by 640, convert centers to corners, filter scores and apply NMS. NMS is not embedded. Subtract letterbox left/top padding, divide by resize scale, then clip coordinates to the original image bounds. Handle preview rotation/mirroring separately.
- Experimental settings from validation: confidence 0.075, NMS IoU 0.6, maximum 100 detections. This low confidence favors recall and can produce false-positive OCR crops. It is not a product-identity confidence guarantee.
- Put best.tflite and labels.txt into app/src/main/assets/. Check your existing Android decoder against these shapes and layouts before replacing its model.

The alternate `TFLite_Export` directory contains NHWC models whose boxes are in pixels. They have a different contract. Do not mix their preprocessing/decoding instructions with this model.

## Verification

The LiteRT interpreter allocated the model, its tensors were inspected, and inference was compared with the selected PyTorch checkpoint on six real validation images, including three phone photos. Maximum coordinate difference: 0.00160217 pixels. Maximum score difference: 0.00000256. No Flex operators were found. ZIP CRC, file SHA256 and the TFLite flatbuffer identifier were checked after local import.

Model SHA256: `d05bc978f395e83321bd25c7f76e9ef17d59d7cc47b956ee4e04150e756017ff`. Raw measurements and operators are in manifest.json. The included verification script targets the existing Colab study runtime. This verifies conversion numerics; full TFLite mAP and Android device latency/delegate/camera integration have not been tested. This is a product-name-region detector, not OCR.

See [Ultralytics LiteRT export documentation](https://docs.ultralytics.com/integrations/litert/).
