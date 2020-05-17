// https://stackoverflow.com/questions/42733761/how-to-properly-append-django-csrf-token-to-form-in-inline-javascript

document.addEventListener("DOMContentLoaded", () => {
    const anchors = document.anchors;
    const menu_items = document.getElementById("menu-items");
    let order_div = document.createElement("div");
    let option_div = document.createElement("div");
    let price_div = document.createElement("div");
    for (i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', (event) => {
            build_menu(event.currentTarget.name);
        });
    }

    function ajax_req(req, api_endpoint) {
        return new Promise((res, rej) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", api_endpoint);
            xhr.onload = () => {
                // console.log('got here');
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    // console.log(data);
                    res(data);
                } else {
                    rej({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }

            }
            const fdata = new FormData();
            for (key in req) {
                fdata.append(key, req[key]);
            }
            // fdata.append(req_key, req);
            fdata.append('csrfmiddlewaretoken', csrftoken);
            xhr.send(fdata);
        });
    }

    function place_order(size, id) {
        console.log("placed order: " + size + ", id: " + id);
    }

    async function build_prices(order_title, sel_cnt) {
        clear_menu(price_div);
        // console.log(order_title, i);
        price_div = document.createElement("div");
        price_div.className = "price-div";
        try {
            req = {
                "order_title": order_title,
                "sel_cnt": sel_cnt
            }
            const data = await ajax_req(req, "/ajax/price");
            console.log(data);
            const prices = data.prices;

            for (i in prices) {
                const br = document.createElement("BR");
                const size = prices[i].size;
                const price = prices[i].price;
                const id = prices[i].id;
                const selection = document.createElement("input");
                selection.type = "radio";
                selection.name = "price";
                selection.value = size;
                selection.id = size;
                selection.onclick = () => {
                    place_order(size, id)
                }
                const label = document.createElement("label");
                label.htmlFor = size;
                label.innerHTML = size + ": " + price;
                price_div.append(selection);
                price_div.append(label);
                price_div.append(br);
            }
            menu_items.append(price_div);
        }
        catch (err) {
            console.log("Error: " + err);
        }
    }

    async function build_options(order_title, sel_lim) {
        //console.log("got here - build_options "+ order_title );
        clear_menu(price_div);
        clear_menu(option_div);
        option_div = document.createElement("div");
        option_div.className = "option-div";

        let topping_lim = 0;
        try {
            const data = await ajax_req({ "order_title": order_title }, "/ajax/option");
            // console.log(data);
            const options = data.options;

            for (i in options) {
                const br = document.createElement("BR");
                const option_name = data.options[i].option_name;
                if (option_name.includes("Topping")) {
                    topping_lim++;
                }
                else if (option_name.includes("Selection(s)")) {
                    const cnt = i;
                    build_prices(order_title, cnt);
                }
                else {
                    const selection = document.createElement("input");
                    selection.type = "radio";
                    selection.name = "option";
                    selection.value = option_name;
                    selection.id = option_name;
                    const cnt = i;
                    selection.onclick = () => {

                        build_prices(order_title, cnt);
                    };
                    const label = document.createElement("label");
                    label.htmlFor = option_name;
                    label.innerHTML = option_name;

                    option_div.append(selection);
                    option_div.append(label);
                    option_div.append(br);
                }
            }

            if (topping_lim) {
                const br = document.createElement("BR");
                const num = document.createElement("input");
                num.type = "number";
                num.value = 0;
                num.min = 0;
                num.max = topping_lim;
                //console.log("topping lim: " + topping_lim);
                num.hidden = true;

                const add_sel = document.createElement("input");
                add_sel.type = "radio";
                add_sel.name = "option";
                add_sel.value = "Add_Topping";
                add_sel.id = "Add_Topping";
                add_sel.onclick = () => {
                    num.value++;
                    const cnt = num.value;
                    if (cnt < topping_lim) {
                        //console.log("how many toppings: " + cnt)
                        build_prices(order_title, cnt);

                        rem_sel.disabled = false;
                        rem_sel.hidden = false;
                        rem_label.hidden = false;
                    }
                    else if (cnt == topping_lim) {
                        //console.log("how many toppings: " + cnt)
                        build_prices(order_title, cnt);
                        rem_sel.disabled = false;
                        rem_sel.hidden = false;
                        rem_label.hidden = false;
                        add_sel.disabled = true;
                        add_sel.hidden = true;
                        add_label.hidden = true;
                        add_label.disabled = true;
                    }
                    else {
                        add_sel.disabled = true;
                        add_sel.hidden = true;
                        add_label.hidden = true;
                        add_label.disabled = true;
                        num.value = topping_lim;
                    }
                }

                const rem_sel = document.createElement("input");
                rem_sel.type = "radio";
                rem_sel.name = "option";
                rem_sel.value = "Remove_Topping";
                rem_sel.id = "Remove_Topping";
                rem_sel.disabled = true;
                rem_sel.hidden = true;
                rem_sel.onclick = () => {
                    num.value--;
                    const cnt = num.value;
                    if (cnt > 0) {
                        //console.log("how many toppings: " + cnt)
                        build_prices(order_title, cnt);
                        add_sel.disabled = false;
                        add_sel.hidden = false;
                        add_label.hidden = false;
                        add_label.disabled = false;
                    }
                    else if (cnt == 0) {
                        //console.log("how many toppings: " + cnt)
                        build_prices(order_title, cnt);
                        rem_sel.disabled = true;
                        rem_sel.hidden = true;
                        rem_label.hidden = true;
                        add_sel.disabled = false;
                        add_sel.hidden = false;
                        add_label.hidden = false;
                        add_label.disabled = false;
                    }
                    else {
                        rem_sel.disabled = true;
                        rem_sel.hidden = true;
                        rem_label.hidden = true;
                        num.value = 0;
                    }
                }

                const add_label = document.createElement("label");
                add_label.htmlFor = "Add_Topping";
                add_label.innerHTML = "Add Topping";
                const rem_label = document.createElement("label");
                rem_label.htmlFor = "Remove_Topping";
                rem_label.innerHTML = "Remove Topping";
                rem_label.hidden = true;
                option_div.append(num);
                option_div.append(add_sel);
                option_div.append(add_label);
                option_div.append(br);
                option_div.append(rem_sel);
                option_div.append(rem_label);

            }

            menu_items.append(option_div);
        }
        catch (err) {
            console.log("Error:" + err);
        }

    }

    function clear_menu(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.lastChild);
        }
    }

    function build_orders(orders) {
        clear_menu(order_div);
        order_div = document.createElement("div");
        order_div.className = "order-div";

        for (i in orders) {
            const title = orders[i].title;
            const sel_lim = orders[i].selection_limit;
            const br = document.createElement("BR");
            const selection = document.createElement("input");
            selection.type = "radio";
            selection.name = "title";
            selection.value = title;
            selection.id = title;
            selection.onclick = () => {
                build_options(title, sel_lim);
            };
            const label = document.createElement("label");
            label.htmlFor = title;
            label.innerHTML = title;

            order_div.append(selection);
            order_div.append(label);
            order_div.append(br);

            //console.log(orders[i]);
        }
        menu_items.append(order_div);
    }

    async function build_menu(product) {
        clear_menu(menu_items);
        // console.log(product)
        try {
            const data = await ajax_req({ "product": product }, "/ajax/order")
            // console.log(data);
            build_orders(data.orders);
        }
        catch (err) {
            console.log("Error: " + err);
        }
    }
})