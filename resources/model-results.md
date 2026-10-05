# GPU model results

Selected **user_new_finetuned_640**, 640-pixel input. Training ran on a Tesla T4 in a separate Colab notebook. The source notebook and ZIPs are preserved.

## Outcome and tradeoffs

On the same expanded real validation set, mAP50–95 improved **36.34% → 38.66%**. On all 53 test images it improved **37.90% → 39.04%**, and on 14 newly added phone test photos **37.54% → 45.70%**. These are modest measured gains, with no statistical significance established.

The model did not improve every measure: original 39-image test mAP50–95 fell **38.68% → 36.90%**, overall test mAP50 fell **79.63% → 78.68%**, and at separately validation-selected app thresholds precision fell **72.22% → 69.33%** while recall stayed **81.25%**. All-phone test app recall fell **85.71% → 77.14%**. Keep the original checkpoint available for comparison; the selected checkpoint is an experimental mAP50–95 winner, not a universal replacement.

The low confidence setting (0.075) maximizes validation F2 and yields validation precision 52.53%, recall 80.00%, with 47 false-positive boxes. Treat detections as OCR crop proposals; this setting is not validated for confidently announcing product identity.

Evaluation uses identical portable copies capped at 2048 pixels on the longest side; the full-resolution 443-image release is preserved separately. The newer checkpoint scores 45.15% on the original mixed 63-image validation set but 31.74% on its 51 real images. Package drawings and changes in evaluation composition explain why historical 44–47% scores should not be directly compared with the expanded real-photo scores.

## Validation comparison

| Candidate | mAP50 | mAP50–95 | Eligible |
|---|---:|---:|---|
| supplied_320 | 47.24% | 17.09% | Diagnostic only |
| supplied_640 | 27.86% | 8.44% | Diagnostic only |
| archive_320 | 47.70% | 16.45% | Diagnostic only |
| archive_640 | 34.22% | 7.57% | Diagnostic only |
| cpu_warmstart_640 | 66.52% | 29.59% | Diagnostic only |
| clean_nano_640 | 71.94% | 35.84% | Yes |
| clean_small_960 | 70.06% | 32.92% | Yes |
| clean_nano_960 | 64.88% | 33.85% | Yes |
| refinement | 71.71% | 35.78% | Yes |
| user_new_320 | 59.25% | 25.65% | Yes |
| user_new_640 | 69.58% | 36.34% | Yes |
| user_new_960 | 50.80% | 22.39% | Yes |
| user_new_finetuned_640 | 69.16% | 38.66% | Yes |

Validation uses 62 real images and 65 name boxes. The earlier 320-pixel checkpoint, archived checkpoint and CPU warm start are diagnostic only. A different 640-pixel checkpoint was subsequently supplied; the user identifies it as trained on the original 369-image ZIP. It and its predeclared fine-tune are eligible alongside the clean COCO-started candidates. The capture-ID finding applies to the earlier 320-pixel file’s recorded local folder, which changed after that checkpoint was saved; it does not prove leakage and is not direct evidence about the newer Colab checkpoint. Training-time folder contents and initial checkpoint exposure cannot be independently reconstructed. Selection and confidence use validation only.

## Test results after selection

| Model / subset | Images | mAP50 | mAP50–95 | App precision | App recall |
|---|---:|---:|---:|---:|---:|
| user_new_baseline / all_test | 53 | 79.63% | 37.90% | 72.22% | 81.25% |
| user_new_baseline / original_test | 39 | 80.00% | 38.68% | 71.43% | 79.55% |
| user_new_baseline / new_phone_test | 14 | 79.63% | 37.54% | 68.18% | 75.00% |
| selected / all_test | 53 | 78.68% | 39.04% | 69.33% | 81.25% |
| selected / original_test | 39 | 79.19% | 36.90% | 70.59% | 81.82% |
| selected / new_phone_test | 14 | 78.31% | 45.70% | 66.67% | 70.00% |

Selected app confidence: **0.075**; NMS IoU **0.6**. Baseline uses its own validation-selected resolution (640) and confidence (0.225). Standard validator precision/recall use its curve operating point and differ from the app metrics shown here.

The headline baseline is the newly supplied 640-pixel checkpoint, not the earlier 320-pixel file. The original 39-image test family was exposed in earlier notebook outputs. The 14 new phone test images cover only Chobani, One A Day and Fritos packages and are absent from the original 369-image ZIP. There are 23 phone test images overall and only one empty-label test image. Background brands and brands on different packages can recur across splits. Stock-photo capture provenance is incomplete. Historical scores and repeated benchmark exposure do not establish a clean causal estimate or broad generalization.

## What changed

- Added 74 oriented and manually annotated real phone captures; excluded 79 variants of existing captures.
- Kept primary physical-package views together and preserved the original test subset.
- Used 268 real training images; excluded package drawings from the clean study.
- Compared nano 640, small 960 and nano 960 from standard pretrained weights, followed by a declared low-learning-rate fine-tune of the newer user checkpoint; used explicit AdamW, modest geometry/brightness changes, and no mirrored text or mosaic.
- Retained the best validation candidate after conservative refinement; selected an app threshold on validation and saved missed-name/false-positive overlays.

## Using the model

`GPU_Results/selected_best.pt` is an optimizer-stripped inference checkpoint. `deployment_settings.json` contains its SHA256 and inference settings. `predict_product_names.py` loads these settings, respects photo orientation and saves detected crops. Green prediction/red annotation overlays, training CSVs, selection records and raw test metrics are included.

These scores measure **name-region detection**, not OCR, exact product identity, expiration-date reading or speech. Some target boxes enclose only a brand such as Sprouts or Kirkland, which cannot uniquely identify a product variant. Add human OCR transcripts and evaluate character error rate, word error rate and exact product-name correctness separately. Review annotation-policy consistency, collect more independent physical packages/sessions and real negative phone scenes, and include actual damaged/occluded labels and price tags.

The selected model is the best measured candidate in this study; global maximum accuracy is not established. Measure exported-model accuracy and target-phone latency before deployment. GPU timings are not mobile timings.

See [Ultralytics validation metrics](https://docs.ultralytics.com/modes/val/) and [training settings](https://docs.ultralytics.com/modes/train/).

## Artifact verification

The 31,523,297-byte Colab result ZIP was imported through visible notebook output after browser downloads failed; its SHA256 matches the Colab export. ZIP CRC checks passed. The selected checkpoint is optimizer-stripped, one class, 640 input, SHA256 `28cc3f0970f44530451508290867ff4e654837ad11fb3c8227f57caf93f7d4c2`. Local CPU inference on a full-resolution validation phone photo passed and produced two crops. The brand crop was visually reviewed. This smoke check verifies loading and output generation, not additional accuracy.
