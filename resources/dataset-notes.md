# Expanded real-photo dataset

Sean Farmer's 369-image verified dataset is preserved in `Merged_Product_Dataset_Expanded_443.zip` with **74 additional annotated photos** from `Archive.zip`. macOS resource-fork entries are ignored. HEIC photos were oriented and converted to JPEG; EXIF is removed. The original ZIPs and notebook are unchanged.

`drive-download-2.zip` contains 79 JPG variants of 52 captures already included in the original dataset. Perceptual image comparisons confirm the duplicates/near-duplicates. They are excluded rather than becoming new independent training or test examples. See `new_photos/intake_summary.json`.

| Set | All images | Real images used | New photos |
|---|---:|---:|---:|
| Training | 316 | 268 | 49 |
| Validation | 74 | 62 | 11 |
| Test | 53 | 53 | 14 |

The full archive retains 60 package drawings, including 48 in training and 12 in validation. This GPU study excludes them. The real evaluation lists are explicit; folders cannot silently add old files to a run.

All 74 new photos were manually annotated at a 600×800 reference size and inspected as red-box overlays. There are 90 added boxes. Names on readable background packages are included where identified; dosage, instructions, nutrition and appliance brands are excluded. The target is a contiguous identifying name/brand region, not the whole package. These are manually placed annotations, not independently double-annotated ground truth. Original annotations are preserved and some contain broader descriptive text; review consistency against the exact app definition before claiming reading accuracy.

New capture groups:

| Physical package / capture group | Split | Images |
|---|---|---:|
| Sprouts garbanzo beans | Training | 4 |
| Sprouts tri-blend beans | Training | 5 |
| Sprouts garlic salt | Training | 4 |
| Chobani yogurt | Test | 5 |
| Pepsi can | Training | 4 |
| Kirkland milk | Validation | 5 |
| Primal Kitchen mayonnaise | Training | 4 |
| One A Day | Test | 5 |
| Advil, with existing Advil group | Training | 3 |
| Old Spice | Training | 5 |
| Melatonin | Training | 5 |
| Aquaphor | Validation | 6 |
| Kirkland pretzels | Training | 6 |
| Fritos bag | Test | 4 |
| Oreo bag | Training | 3 |
| Kirkland protein bars | Training | 6 |

Views of each primary physical package remain together. Background brands and brands printed on different packages can recur across splits; this is **not an unseen-brand test**. Capture provenance for the original stock/close-up images is incomplete. Exact pixel duplicate checks cannot prove those images are independent.

The test comparison reports all 53 test images, the original 39, and the 14 new phone photos separately. The original test family appeared in the user's earlier notebook. The new phone test groups are held aside before this training, but three groups remain a small sample. The **earlier 320-pixel checkpoint's** recorded training folder currently contains 42 evaluation capture IDs; the folder changed after its save date, so this does not prove prior training exposure. These older checkpoints are diagnostic only. The user subsequently supplied a different 640-pixel checkpoint and identified its source as the original 369-image ZIP; it and its fine-tune are included alongside clean COCO-started candidates in final validation selection. The earlier local-folder finding is not direct evidence about the newer Colab checkpoint. See `analysis/capture_provenance.json` and `CHECKPOINT_UPDATE.md`. Collect new physical packages and capture sessions for an independent final benchmark.

The GPU training bundle includes a portable copy with maximum image side 2048 pixels, unchanged normalized boxes, and a rebuilt SHA256 manifest. The full-resolution expanded archive remains available. Both match the same 443 image identities and split assignments. GPU training inputs are 640/960 pixels.

Verification: all image/label pairs, numeric coordinates, manifests, exact pixel uniqueness and known primary-group split assignments were checked. `analysis/expanded_dataset_verification.json` records full-archive preparation. The GPU helper repeats these checks on the uploaded training copy.

Training and selection settings follow the [Ultralytics training interface](https://docs.ultralytics.com/modes/train/); detection scores use its [validation metrics](https://docs.ultralytics.com/modes/val/). These scores do not measure recognized text, exact product identity or speech output.
