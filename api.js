var searchParams = new URLSearchParams(window.location.search)
var query = searchParams.get('q')

var sUserId = String(Math.floor(Math.random()*1000));

let encodeAmtReq = new XMLHttpRequest()
encodeAmtReq.open('GET', '/encodeAmt')
encodeAmtReq.addEventListener('load', function() {
  let encodeAmt = this.responseText
  let encodeEle = document.createElement('div')
  encodeEle.style.width = encodeAmt
  document.body.appendChild(encodeEle)
  encodeAmt = encodeEle.clientWidth
  encodeEle.remove()

  function getJunk(val) {
    let i = 1
    while (i < encodeAmt) {
      val = atob(val)
      i++
    }
    return(val)
  }

  function getKey(val, junk) {
    let i = 1
    while (i < encodeAmt) {
      val = atob(val)
      while (val.includes(junk)) {
        val = val.replace(junk, '')
      }
      i++
    }
    return(val)
  }

  let keyJunkReq = new XMLHttpRequest()
  keyJunkReq.open('GET', '/keyJunk')
  keyJunkReq.addEventListener('load', function() {
    let keyJunk = this.responseText
    keyJunk = getJunk(keyJunk)
    let apiKeyReq = new XMLHttpRequest()
    apiKeyReq.open('GET', '/apiKey')
    apiKeyReq.addEventListener('load', function() {
      let openaiApiKey = this.responseText
      openaiApiKey = openaiApiKey.replace('var openaiApiKey = ', '')
      openaiApiKey = getKey(openaiApiKey, keyJunk)

      var httpReq = new XMLHttpRequest();
      httpReq.open('POST','https://api.openai.com/v1/completions');
      httpReq.setRequestHeader('Accept', 'application/json');
      httpReq.setRequestHeader('Content-Type', 'application/json');
      httpReq.setRequestHeader('Authorization', `Bearer ${openaiApiKey}`)
      httpReq.addEventListener('load', function () {
        var oJson = {}
        var s = '';
        try {
          oJson = JSON.parse(this.responseText);
        } 
        catch (ex) {
          s += `Error: ${ex.error.message}`
        }
        console.log(oJson)
        if (oJson.choices && oJson.choices[0].text) {
          s += oJson.choices[0].text;
          var a = s.split('?\n');
          if (a.length == 2) {
            s = a[1];
          }
          if (s == '') s = 'No response';
        }
        document.body.textContent = s
      });
    
      var sModel = 'gpt-3.5-turbo-instruct-0914';
      var iMaxTokens = 2048;
      var dTemperature = 0.5; 
      var data = {
        model: sModel,
        prompt: query,
        max_tokens: iMaxTokens,
        user: sUserId,
        temperature: dTemperature,
        frequency_penalty: 2.0, //Number between -2.0 and 2.0  
                                //Positive values decrease the model's likelihood 
                                //to repeat the same line verbatim.
        presence_penalty: -2.0,  //Number between -2.0 and 2.0. 
                                //Positive values increase the model's likelihood 
                                //to talk about new topics.
        stop: ['#', ';']        //Up to 4 sequences where the API will stop 
                                //generating further tokens. The returned text 
                                //will not contain the stop sequence.
      }
    
      httpReq.send(JSON.stringify(data));
    })
    apiKeyReq.send()
  })
  keyJunkReq.send()
})
encodeAmtReq.send()