window.sortello = window.sortello || {interval: null};

function handleButtons (err, list) {
  if (err) {
    return
  };

  if (listSortable(list) && !listHasButton(list)) {
    addButton(list);
  }


  if (!listSortable(list) && listHasButton(list)) {
    removeButton(list);
  }

  if (listSortable(list) && !listHasButton(list) && !buttonIsComplete(list)) {
    removeButton(list);
    addButton(list);
  }
}

function cardAppeared (list, cb) {

  var i = 10;

  if (!listSortable(list)) {
    cb(false, list);
    return;
  }

  var interval = setInterval(function () {
    var oneCard = list.querySelectorAll('a.list-card')[0];
    if (oneCard != null) {
      clearInterval(interval);
      cb(false, list);
      return;
    }

    if (i === 0) {
      clearInterval(interval);
      cb(true);
      return;
    }
    i--;
  }, 200);

}

function addButton (list) {
  var oneCard = list.querySelectorAll('a.list-card')[0];
  var oneCardHref = oneCard.href;
  var oneCardUrl = oneCardHref.replace("https://trello.com/c/", "");
  var oneCardId = oneCardUrl.replace(/\/(.*)/g, "")

  var newElement = '<a style="height:19px;" class="list-header-extras-menu dark-hover sortello-link" title="Sort cards with Sortello" target="_blank" href="http://sortello.com/app.html?extId=' + oneCardId + '">' +
      '<span class="icon-sm" style="background: url(' + chrome.runtime.getURL('icon.png') + '); background-size: contain;">' +
      '</span>' +
      '</a>';
  var extras = list.getElementsByClassName('list-header-extras')[0];
  extras.innerHTML = newElement + extras.innerHTML;
}

function removeButton (list) {
  var toRemove = list.getElementsByClassName('sortello-link')[0];
  toRemove.parentNode.removeChild(toRemove);
}

function listSortable (list) {
  return list.getElementsByClassName('list-card').length > 2;
}

function listHasButton (list) {
  return list.getElementsByClassName('sortello-link').length > 0;
}

function buttonIsComplete (list) {
  var suffix = 'extId=';
  var sortelloLink = list.getElementsByClassName('sortello-link');
  if (sortelloLink.href === undefined) {
    return false
  }
  return sortelloLink.href.indexOf(suffix, this.length - suffix.length) !== -1;
}

function showingTrelloBoard () {
  var url = window.location.href;
  var thisRegex = new RegExp('trello.com/b/');
  return thisRegex.test(url);
}

function setButtons () {
  var lists = document.getElementsByClassName('list');

  for (var i = 0; i < lists.length; i++) {
    var list = lists[i];
    if(!buttonIsComplete(list)){
      cardAppeared(list, handleButtons);
    }
  }
}

clearInterval(window.sortello.interval);
if (showingTrelloBoard()) {
  setButtons();
  window.sortello.interval = setInterval(setButtons, 5000);
}
