(() => {
const $ = id => document.getElementById(id);
const fileInput=$('fileInput'), dropzone=$('dropzone'), previewWrap=$('previewWrap'), preview=$('preview');
const verifyBtn=$('verifyBtn'), abortBtn=$('abortBtn'), statusText=$('statusText'), payloadText=$('payloadText');
const logs=$('logs'), result=$('result'), progressWrap=$('progressWrap'), progressBar=$('progressBar'), progressPct=$('progressPct'), progressLabel=$('progressLabel');
let selectedFile=null, objectUrl=null, worker=null, cancelled=false, busy=false;
const expectedChannel = document.querySelector('.channel-link b')?.textContent.trim() || 'Your YouTube Channel';
function log(message, tag='OCR', code='OK') { const row=document.createElement('div');row.className='log';const t=document.createElement('time');t.textContent=tag;const s=document.createElement('span');s.textContent=message;const b=document.createElement('b');b.textContent=code;row.append(t,s,b);logs.append(row);logs.scrollTop=logs.scrollHeight; }
function setStatus(s,p='—'){statusText.textContent=s;payloadText.textContent=p;}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),3000);}
function resetResult(){result.classList.add('hidden');result.classList.remove('fail');}
function resetForNextEntry(){
  selectedFile=null; fileInput.value='';
  if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}
  preview.removeAttribute('src'); previewWrap.classList.add('hidden'); dropzone.classList.remove('hidden');
  verifyBtn.disabled=true; progressWrap.classList.add('hidden'); progress(0,'Preparing OCR');
  logs.innerHTML=''; log('ENGINE_INITIALIZED','SYS','OK'); log('WAITING_FOR_USER_INPUT','SYS','--'); log('READY_FOR_IMAGE','OCR','--');
  setStatus('Idle','Awaiting file'); resetResult(); window.scrollTo({top:0,behavior:'smooth'});
}
function chooseFile(file){
 if(!file)return;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)){toast('Please choose a JPG, PNG or WEBP image.');return;}
 if(file.size>5*1024*1024){toast('Image exceeds the 5 MB limit.');return;}
 selectedFile=file; if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(file);preview.src=objectUrl;
 $('fileName').textContent=file.name;previewWrap.classList.remove('hidden');dropzone.classList.add('hidden');verifyBtn.disabled=false;resetResult();setStatus('Ready', 'Image loaded');log('IMAGE_BUFFER_LOADED • '+Math.round(file.size/1024)+' KB','INPUT','OK');log('READY_FOR_USER_INPUT','SYS','OK');
}
fileInput.addEventListener('change',e=>chooseFile(e.target.files[0]));
$('removeFile').addEventListener('click',()=>{selectedFile=null;fileInput.value='';if(objectUrl)URL.revokeObjectURL(objectUrl);previewWrap.classList.add('hidden');dropzone.classList.remove('hidden');verifyBtn.disabled=true;resetResult();setStatus('Idle','Awaiting file');});
['dragenter','dragover'].forEach(ev=>dropzone.addEventListener(ev,e=>{e.preventDefault();dropzone.classList.add('drag')}));
['dragleave','drop'].forEach(ev=>dropzone.addEventListener(ev,e=>{e.preventDefault();dropzone.classList.remove('drag')}));
dropzone.addEventListener('drop',e=>chooseFile(e.dataTransfer.files[0]));
function progress(p,label){progressWrap.classList.remove('hidden');progressBar.style.width=p+'%';progressPct.textContent=Math.round(p)+'%';progressLabel.textContent=label;}
function showResult(ok, code, message, note=''){
 result.classList.remove('hidden');result.classList.toggle('fail',!ok);
 $('resultIcon').textContent=ok?'✓':'!';
 $('resultKicker').textContent=ok?'ACCESS GRANTED':'ACCESS DENIED';
 $('resultTitle').textContent=ok?'Subscription markers matched':'Verification failed';
 $('resultMessage').textContent=message;
 $('resultCode').textContent=code;
 $('continueBtn').classList.toggle('hidden',!ok);
 $('resourceBtn').classList.toggle('hidden',!ok);
 $('retryBtn').classList.toggle('hidden',ok);
 $('resultNote').textContent=note;
 result.scrollIntoView({behavior:'smooth',block:'center'});
}
async function verify(){
 if(!selectedFile||busy)return;
 busy=true;cancelled=false;verifyBtn.disabled=true;abortBtn.classList.remove('hidden');setStatus('Analyzing','Image scan');logs.innerHTML='';log('ANALYSIS_INITIALIZED','SYS','OK');log('IMAGE_BUFFER_LOADED','INPUT','OK');progress(5,'Preparing OCR engine');
 try{
  if(!window.Tesseract)throw new Error('OCR library could not load. Check your internet connection and retry.');
  log('LOADING_TESSERACT_ENGINE','OCR','RUN');progress(12,'Loading OCR engine');
  worker=await Tesseract.createWorker('eng',1,{logger:m=>{if(cancelled)return;if(m.status==='recognizing text'){const p=18+Math.round((m.progress||0)*70);progress(p,'Recognizing visible text');}}});
  if(cancelled)throw new Error('Operation cancelled.');
  log('OCR_ENGINE_READY','OCR','OK');log('READING_IMAGE_TEXT','OCR','RUN');progress(22,'Reading screenshot text');
  const {data}=await worker.recognize(selectedFile);
  await worker.terminate();worker=null;
  if(cancelled)throw new Error('Operation cancelled.');
  const raw=data.text||'';const normalized=raw.toLowerCase().replace(/\s+/g,' ').trim();
  log('TEXT_EXTRACTION_COMPLETE','OCR','OK');
  // Avoid broad matching of the word "subscribe": require the visible state label.
  const hasSubscribed=/\bsubscribed\b/i.test(raw);
  const channelWords=expectedChannel.toLowerCase().split(/[^a-z0-9]+/).filter(w=>w.length>2);
  const foundWords=channelWords.filter(w=>normalized.includes(w));
  const channelMatch=channelWords.length>0 && foundWords.length>=Math.max(1,Math.ceil(channelWords.length*0.6));
  log('VALIDATING_SUBMISSION','MATCH','RUN');
  progress(100,'Analysis complete');
  if(channelMatch&&hasSubscribed){setStatus('Matched','Text patterns found');log('PATTERN_MATCH_SUCCESSFUL','SYS','PASS');showResult(true,'VERIFICATION_COMPLETE','Your submission has been processed successfully.','');}
  else {setStatus('Denied','Pattern not found');log('VALID_SUBSCRIPTION_MARKERS_NOT_FOUND','SYS','FAIL');showResult(false,'VERIFICATION_FAILED','We could not verify this submission.','Please try again with a clear, valid screenshot.'); setTimeout(()=>{ if(!busy && result.classList.contains('fail')) resetForNextEntry(); },5000);}
 }catch(err){if(worker){try{await worker.terminate()}catch{}worker=null;}setStatus(cancelled?'Aborted':'Error','No result');log(err.message||'OCR_ERROR','SYS','ERR');showResult(false,cancelled?'OPERATION_ABORTED':'OCR_ENGINE_ERROR',err.message||'OCR could not complete.','Check the image and network connection, then retry.');}
 finally{busy=false;verifyBtn.disabled=!selectedFile;abortBtn.classList.add('hidden');}
}
verifyBtn.addEventListener('click',verify);
abortBtn.addEventListener('click',()=>{cancelled=true;setStatus('Aborting','Please wait');});
$('retryBtn').addEventListener('click',()=>resetForNextEntry());
$('continueBtn').addEventListener('click',()=>resetForNextEntry());
$('resourceBtn').addEventListener('click',()=>{
  window.open('https://github.com/ashbornofficial','_blank','noopener,noreferrer');
});
$('helpBtn').addEventListener('click',()=>$('helpDialog').showModal());
['closeHelp','closeHelp2'].forEach(id=>$(id).addEventListener('click',()=>$('helpDialog').close()));
})();