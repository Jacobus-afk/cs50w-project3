document.addEventListener("DOMContentLoaded", async () => {
    const helper = await import("./helper.js");
    const cart_items = document.getElementById("cart-items");
    const cart_removers = document.getElementsByClassName("cart-remove");
    const order_button = document.getElementById("order-button");
    const tally = document.getElementById("cart-tally");
    for (i = 0; i < cart_removers.length; i++) {
        cart_removers[i].addEventListener('click', (event) => {
            const id = event.currentTarget.name;
            const price = document.getElementById(id+"-cart-price");
            // console.log(price.innerHTML);
            const new_tally = parseFloat(tally.innerHTML) - parseFloat(price.innerHTML);
            tally.innerHTML = (+new_tally).toFixed(2);
            dump_cart_item_backend(id);
            document.getElementById(id).remove();
            helper.decr_cart_cnt();
            
            const children_with_id = Array.prototype.filter.call(cart_items.children, (child) => {
                return child.id != "";
            });
            if (children_with_id.length === 0) {
                order_button.disabled = true;
            }
            // console.log(children_with_id);
        })
    }

    order_button.onclick = async () => {

        // console.log("order button clicked");
        try {
            const data = await helper.ajax_req({"place_order": "place_order"}, "/ajax/placeorder");
        }
        catch(err) {
            console.log("Place order Error: " + err);
        }
    }

    async function dump_cart_item_backend(id) {
        try{
            const data = await helper.ajax_req({"dump_item": id}, "/ajax/takefromcart");
            console.log(data);
        }
        catch(err) {
            console.log("Backend dump cart item Error: " + err);
        }
    }
})