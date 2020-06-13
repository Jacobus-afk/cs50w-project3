document.addEventListener("DOMContentLoaded", () => {
    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/chat/'
        + 'orders/'
    );

    chatSocket.onmessage = msg => {
        const data = JSON.parse(msg.data)
        if (data.order === "complete") {
            const id = data.id;
            const complete_span = document.getElementById("pending-id-" + id);
            complete_span.innerHTML = "Delivering...";
        }
        if (data.delivery === "complete") {
            const id = data.id;
            const complete_span = document.getElementById("pending-id-" + id);
            complete_span.innerHTML = "Delivered";
        }
        // console.log(msg.data);
    };

    chatSocket.onclose = () => {
        console.error('Websocket closed unexpectedly');
    };
})