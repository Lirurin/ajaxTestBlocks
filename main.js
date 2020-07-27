const fields = document.querySelectorAll('.block__field');
const url = 'http://localhost/buttons/blocks.php';

document.addEventListener('click',function(e){
  if(e.target && e.target.classList.contains('js-block__refresh')){
    refreshBlock(e.target)
  }
});

function refreshBlock(target) {
  let blockNum = target.dataset.block
  let linkedTo = target.dataset.linked;
  target.disabled = true;
  target.innerHTML = 'Пожалуйста подождите...';

  // Отключение кнопки обновляемого блока
  for (child of fields[linkedTo].children) {
    child.classList.contains('js-block__refresh') ? child.disabled = true: null;
  }

  return new Promise((succeed, fail) => {
    let request = new XMLHttpRequest();

    request.open("GET", url, true);
    request.addEventListener("load", () => {
      if (request.status < 400) {
        target.disabled = false;
        target.innerHTML = `Обновить блок ${linkedTo}`;
        fields[linkedTo].innerHTML = `<span>Блок ${linkedTo}</span><div>${request.response}</div><button class="js-block__refresh" data-block="${linkedTo}" data-linked="${blockNum}">Обновить блок ${blockNum}</button>`
        succeed(request.response);
      } else {
        target.disabled = false;
        target.innerHTML = `Обновить блок ${linkedTo}`;
        fail(new Error("Request failed: " + request.statusText));
      }
    });

    request.addEventListener("error", () => {
      fail(new Error("Ошибка сети"));
    });
    
    request.send();
  });
}