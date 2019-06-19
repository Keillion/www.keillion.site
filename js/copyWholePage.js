var myTextarea = document.createElement('textarea');
myTextarea.value = document.body.parentElement.outerHTML;
document.body.append(myTextarea);
myTextarea.focus();
myTextarea.select();
document.execCommand('copy');//useless, please copy yourself