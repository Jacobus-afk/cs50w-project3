document.addEventListener("DOMContentLoaded", async () => {
    const helper = await import("./helper.js");
    const order_complete_btns = document.getElementsByClassName("order-complete-button");
    const delivery_complete_btns = document.getElementsByClassName("delivery-complete-button");
    // https://channels.readthedocs.io/en/latest/tutorial/part_2.html
    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/chat/'
        + 'orders/'
    );

    for (i = 0; i < order_complete_btns.length; i++) {
        order_complete_btns[i].addEventListener('click', (event) => {
            const id = event.currentTarget.getAttribute("data-cartid");
            const user = event.currentTarget.getAttribute("data-cartuser");
            chatSocket.send(JSON.stringify({
                'order': 'complete',
                'id': id,
                'user': user
            }))
            // console.log(id);
        })
        delivery_complete_btns[i].addEventListener('click', (event) => {
            const id = event.currentTarget.getAttribute("data-cartid");
            const user = event.currentTarget.getAttribute("data-cartuser");
            chatSocket.send(JSON.stringify({
                'delivery': 'complete',
                'id': id,
                'user': user
            }))
        })
    }

    chatSocket.onmessage = async (msg) => {
        const data = JSON.parse(msg.data)
        // console.log(data);
        const id = data.id;
        const delivery_button = document.getElementById("delivered-btn-" + id);
        const complete_button = document.getElementById("complete-btn-" + id);

        if (data.order === "complete") {
            // console.log(id);
            complete_button.classList.add("disabled");
            delivery_button.classList.remove("disabled");
            // console.log(complete_button);
        }
        if (data.delivery === "complete") {
            delivery_button.classList.add("disabled");
            try{
                const data = await helper.ajax_req({"dump_cart_item": id}, "/ajax/dropcartitem");
                // console.log(data);
            }
            catch(err) {
                console.log("Drop cart item error: " + err);
            }
        }
        // console.log(data);
    };

    chatSocket.onclose = () => {
        console.error('Websocket closed unexpectedly');
    };
})