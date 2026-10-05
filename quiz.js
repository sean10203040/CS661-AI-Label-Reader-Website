"use strict";
const checked = new Map();
const feedback = (n, correct, message) => {
  const el = document.getElementById(`feedback-${n}`);
  el.dataset.correct = String(correct);
  el.textContent = message;
  checked.set(n, correct);
  document.getElementById('progress').textContent = `${checked.size} of 5 activities checked`;
  const passed = [...checked.values()].filter(Boolean).length;
  document.getElementById('score').textContent = `${passed} of ${checked.size} currently correct`;
  document.getElementById('finish-status').textContent = checked.size === 5 ?
    `${passed} of 5 activities correct. ${passed === 5 ? 'You distinguished detection from OCR, traced the pipeline, measured a text error, and annotated a name region.' : 'Review the explanations and retry any activity. Your latest checked answer replaces the previous result.'}` :
    'Check all five activities for a final recap. You can retry any answer.';
};
document.getElementById('match-form').addEventListener('submit', e => {
  e.preventDefault();
  const ok = document.getElementById('box-stage').value === 'detect' && document.getElementById('text-stage').value === 'ocr';
  feedback(1, ok, `${ok ? 'Correct.' : 'Try again.'} Object detection returns a location and score. OCR recognition returns the characters inside an image or crop. A box confidence does not tell you whether the text was read correctly.`);
});
document.getElementById('text-form').addEventListener('submit', e => {
  e.preventDefault();
  const value = document.getElementById('transcription').value.trim().toUpperCase().replace(/\s+/g, ' ');
  const ok = value === 'ONE A DAY';
  feedback(2, ok, `${ok ? 'Correct: the first character is the letter O.' : 'Compare the first character with the reference: it is the letter O, not the digit 0.'} OCR can confuse similar glyphs. Checking against the image is safer than assuming a confident detection guarantees a correct transcription.`);
});
const orderList = document.getElementById('pipeline-list');
function updateOrderButtons() {
  const items = [...orderList.children];
  items.forEach((item, i) => {
    item.querySelector('[data-move="up"]').disabled = i === 0;
    item.querySelector('[data-move="down"]').disabled = i === items.length - 1;
  });
}
orderList.addEventListener('click', e => {
  const button = e.target.closest('button[data-move]');
  if (!button) return;
  const item = button.closest('li');
  if (button.dataset.move === 'up' && item.previousElementSibling) orderList.insertBefore(item, item.previousElementSibling);
  else if (button.dataset.move === 'down' && item.nextElementSibling) orderList.insertBefore(item.nextElementSibling, item);
  updateOrderButtons();
  const position = [...orderList.children].indexOf(item) + 1;
  document.getElementById('order-status').textContent = `${item.querySelector('span').textContent} moved to position ${position}.`;
  // Keep keyboard focus on the moved row, even if its selected direction is now disabled.
  const focusButton = button.disabled ? item.querySelector('button:not(:disabled)') : button;
  focusButton.focus();
});
document.getElementById('check-order').addEventListener('click', () => {
  const ok = [...orderList.children].map(item => item.dataset.step).join(',') === 'capture,detect,crop,ocr';
  feedback(3, ok, `${ok ? 'Correct order.' : 'Review the sequence.'} Capture and orient the photo, detect candidate regions, filter and crop the boxes, then run OCR on those crops. The reading stage depends on the crop preserving the text.`);
});
updateOrderButtons();
document.getElementById('cer-form').addEventListener('submit', e => {
  e.preventDefault();
  const answer = Number(document.getElementById('cer').value);
  const ok = Math.abs(answer - 100 / 6) <= 0.15;
  feedback(4, ok, `${ok ? 'Correct.' : 'Count the six reference characters.'} One substitution divided by six characters gives a CER of approximately 16.7%. The complete word is still incorrect. Report exact-name correctness separately from character error rate.`);
});
const area = document.getElementById('draw-area');
const userBox = document.getElementById('user-box');
const refBox = document.getElementById('reference-box');
const fields = ['x', 'y', 'w', 'h'].map(name => document.getElementById(`box-${name}`));
// Saved manual YOLO annotation: cx=.374166667, cy=.416875, w=.295, h=.06375.
const reference = {x: .226666667, y: .385, w: .295, h: .06375};
let box = null, origin = null, activePointer = null;
function showBox(el, b) {
  el.hidden = !b;
  if (b) Object.assign(el.style, {left: `${b.x*100}%`, top: `${b.y*100}%`, width: `${b.w*100}%`, height: `${b.h*100}%`});
}
function renderBox(b) {
  box = b;
  showBox(userBox, b);
  if (b) [b.x,b.y,b.w,b.h].forEach((v,i) => fields[i].value = (v*100).toFixed(1));
}
function point(e) {
  const r = area.getBoundingClientRect();
  return {x: Math.max(0, Math.min(1, (e.clientX-r.left)/r.width)), y: Math.max(0, Math.min(1, (e.clientY-r.top)/r.height))};
}
area.addEventListener('pointerdown', e => {
  if (e.button !== 0 || activePointer !== null) return;
  e.preventDefault();
  origin = point(e); activePointer = e.pointerId;
  area.setPointerCapture(e.pointerId);
  refBox.hidden = true;
  renderBox({x:origin.x,y:origin.y,w:0,h:0});
});
area.addEventListener('pointermove', e => {
  if (e.pointerId !== activePointer || !origin) return;
  const p = point(e);
  renderBox({x:Math.min(origin.x,p.x),y:Math.min(origin.y,p.y),w:Math.abs(p.x-origin.x),h:Math.abs(p.y-origin.y)});
});
function endDrawing(e) {
  if (e.pointerId !== activePointer) return;
  origin = null; activePointer = null;
  if (area.hasPointerCapture(e.pointerId)) area.releasePointerCapture(e.pointerId);
  document.getElementById('box-status').textContent = box && box.w > .002 && box.h > .002 ? 'Box drawn. Check it below or draw again.' : 'Drag a rectangle with some width and height.';
}
area.addEventListener('pointerup', endDrawing);
area.addEventListener('pointercancel', endDrawing);
function readCoordinates() {
  if (fields.some(f => f.value === '' || !f.checkValidity())) return null;
  const [x,y,w,h] = fields.map(f => Number(f.value)/100);
  if (![x,y,w,h].every(Number.isFinite) || w<=0 || h<=0 || x+w>1.001 || y+h>1.001) return null;
  return {x,y,w:Math.min(w,1-x),h:Math.min(h,1-y)};
}
document.getElementById('apply-box').addEventListener('click', () => {
  const b = readCoordinates();
  if (!b) { document.getElementById('box-status').textContent = 'Enter valid percentages. The box must fit entirely inside the photo.'; return; }
  renderBox(b); refBox.hidden = true;
  document.getElementById('box-status').textContent = 'Coordinates previewed. Check your box when ready.';
});
document.getElementById('box-form').addEventListener('submit', e => {
  e.preventDefault();
  const b = readCoordinates();
  if (!b) { document.getElementById('box-status').textContent = 'Draw a box or enter valid percentages that fit inside the photo.'; return; }
  renderBox(b);
  const iw=Math.max(0,Math.min(b.x+b.w,reference.x+reference.w)-Math.max(b.x,reference.x));
  const ih=Math.max(0,Math.min(b.y+b.h,reference.y+reference.h)-Math.max(b.y,reference.y));
  const intersection=iw*ih, union=b.w*b.h+reference.w*reference.h-intersection;
  const iou=union ? intersection/union : 0;
  showBox(refBox,reference);
  feedback(5,iou>=.5,`IoU: ${(iou*100).toFixed(1)}%. ${iou>=.5 ? 'Your box meets this exercise’s 50% overlap target.' : 'Try a tighter box around ONE A DAY, using the green reference as a guide.'} Orange is your box; green is the saved manual annotation. This checks your annotation, not the model or OCR.`);
});
function clearBox() {
  box=null; origin=null; activePointer=null;
  userBox.hidden=true; refBox.hidden=true;
  fields.forEach(f=>f.value='');
  document.getElementById('box-status').textContent='No box drawn yet.';
}
document.getElementById('clear-box').addEventListener('click',clearBox);
document.getElementById('reset-quiz').addEventListener('click',()=>{
  document.querySelectorAll('form').forEach(form=>form.reset());
  ['ocr','capture','crop','detect'].forEach(step=>orderList.append(orderList.querySelector(`[data-step="${step}"]`)));
  updateOrderButtons(); clearBox(); checked.clear();
  document.querySelectorAll('.feedback').forEach(el=>{el.textContent='';delete el.dataset.correct;});
  document.getElementById('order-status').textContent='';
  document.getElementById('progress').textContent='0 of 5 activities checked';
  document.getElementById('score').textContent='Quiz reset. Check an activity to start.';
  document.getElementById('finish-status').textContent='Check all five activities for a final recap. You can retry any answer.';
});
