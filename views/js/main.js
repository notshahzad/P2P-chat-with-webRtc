var socket = io();
const { room, isinitiator } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
var peer = new SimplePeer({
  initiator: eval(isinitiator),
  trickle: false,
});
peer.on("signal", (data) => {
  data = JSON.stringify(data);
  socket.emit("id", { room, data });
});
if (eval(isinitiator) === false) {
  socket.emit("GiveMeOffer", room);
}
socket.on("TakeOffer", (offer) => {
  peer.signal(offer);
});
if (isinitiator) {
  socket.on("Answer", (Answer) => {
    peer.signal(Answer);
  });
}
peer.on("data", (data) => {
  appendmsg(data.toString(), "right");
});
function sendmsg() {
  msg = document.getElementById("msg").value;
  peer.send(msg);
  appendmsg(msg, "left");
}
function appendmsg(message, pos) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
  <p class="text" style="text-align: ${pos};">
      ${message}
  </p>`;
  document.querySelector(".show-message").appendChild(div);
}
socket.emit("user");
