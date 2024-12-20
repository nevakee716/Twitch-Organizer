window.opener.postMessage(
  { 
    type: "TWITCH_AUTH", 
    code: new URLSearchParams(window.location.search).get("code") 
  }, 
  window.location.origin
);
window.close(); 