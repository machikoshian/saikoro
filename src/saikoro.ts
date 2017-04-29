import { Dice, DiceResult } from "./dice";

class HttpRequest {
  static Send(url:string, callback:(response:string) => void) {
    let xhr:XMLHttpRequest = new XMLHttpRequest();
    xhr.onreadystatechange = () => HttpRequest.OnReadyStateChange(xhr,
                                                                  callback);
    xhr.open("GET", url, true);
  }

  static OnReadyStateChange(xhr:XMLHttpRequest,
                            callback:(response:string) => void):void {
    switch (xhr.readyState) {
      case XMLHttpRequest.OPENED:
        xhr.send();
        break;
      case XMLHttpRequest.HEADERS_RECEIVED:
        console.log(xhr.getAllResponseHeaders());
        break;
      case XMLHttpRequest.LOADING:
        break;
      case XMLHttpRequest.DONE:
        callback(xhr.responseText);
        break;
    }
  }
}

function callbackDice(response:string):void {
  let dice:DiceResult = DiceResult.fromObject(JSON.parse(response));
  document.body.innerHTML = "<pre>" + dice.dice1 + "</pre>";
}

HttpRequest.Send("/dice?dice_num=2&aim=7", callbackDice);
