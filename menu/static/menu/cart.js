document.addEventListener("DOMContentLoaded", async () => {
    const helper = await import("./helper.js");
    // const cart_items = document.getElementById("cart-items");
    const cart_removers = document.getElementsByClassName("cart-remove");
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
        })
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