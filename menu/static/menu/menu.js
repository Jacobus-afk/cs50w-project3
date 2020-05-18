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
            fdata.append('csrfmiddlewaretoken', csrftoken);

            xhr.send(fdata);
        });
    }

    function place_order(size, price_id) {
        console.log("placed order: " + size + ", price_id: " + price_id);
    }

    async function build_prices(order_id, sel_cnt) {
        clear_menu(price_div);
        const old_price = document.getElementById("price-div");
        if (old_price) {
            menu_items.removeChild(old_price);
        }

        const helper = await import("./templates.js");
        // console.log(order_title, i);
        price_div = document.createElement("div");
        price_div.className = "price-div";
        price_div.id = "price-div";
        try {
            req = {
                "order_id": order_id,
                "sel_cnt": sel_cnt
            }
            const data = await ajax_req(req, "/ajax/price");
            // console.log(data);
            const prices = data.prices;

            for (i in prices) {
                const br = document.createElement("BR");
                const size = prices[i].size;
                const price = prices[i].price;
                const id = prices[i].id;
                
                const selection = helper.create_radio_input("price", size, size);
                selection.onclick = () => {
                    place_order(size, id)
                }
                const label = helper.create_label(size, size + ": " + price);

                price_div.append(selection);
                price_div.append(label);
                price_div.append(br);
            }
            menu_items.append(price_div);
        }
        catch (err) {
            console.log("Build Price Error: " + err);
        }
    }

    async function build_options(order_id, sel_lim) {
        clear_menu(option_div);
        const old_opt = document.getElementById("option-div");
        if (old_opt) {
            menu_items.removeChild(old_opt);
        }
        //clear_menu(price_div);
        
        const helper = await import("./templates.js");
        option_div = document.createElement("div");
        option_div.className = "option-div";
        option_div.id = "option-div";
        let topping_lim = 0;
        try {
            const data = await ajax_req({ "order_id": order_id }, "/ajax/option");
            const options = data.options;

            for (i in options) {
                const br = document.createElement("BR");
                const option_name = data.options[i].option_name;
                if (option_name.includes("Topping")) {
                    topping_lim++;
                }
                else if (option_name.includes("Selection(s)")) {
                    const cnt = i;
                    build_prices(order_id, cnt);
                }
                else {
                    const selection = helper.create_radio_input("option", option_name, option_name);
                    const cnt = i;
                    selection.onclick = () => {
                        build_prices(order_id, cnt);
                    };
                    const label = helper.create_label(option_name, option_name);

                    option_div.append(selection);
                    option_div.append(label);
                    option_div.append(br);
                }
            }

            if (topping_lim) {
                const br = document.createElement("BR");
                const num = helper.create_num_input(0, 0, topping_lim);
                num.hidden = true;

                const add_sel = helper.create_radio_input("option", "Add_Topping", "Add_Topping");
                const add_label = helper.create_label("Add_Topping", "Add Topping");

                const rem_sel = helper.create_radio_input("option", "Remove_Topping", "Remove_Topping");
                const rem_label = helper.create_label("Remove_Topping", "Remove Topping");
                helper.sel_and_label_toggle(rem_sel, rem_label, true);
                
                add_sel.onclick = () => {
                    num.value++;
                    const cnt = num.value;
                    if (cnt < topping_lim) {
                        build_prices(order_id, cnt);
                        helper.sel_and_label_toggle(rem_sel, rem_label, false);
                    }
                    else if (cnt == topping_lim) {
                        build_prices(order_id, cnt);
                        helper.sel_and_label_toggle(rem_sel, rem_label, false);
                        helper.sel_and_label_toggle(add_sel, add_label, true);
                    }
                    else {
                        helper.sel_and_label_toggle(add_sel, add_label, true);
                        num.value = topping_lim;
                    }
                }

                rem_sel.onclick = () => {
                    num.value--;
                    const cnt = num.value;
                    if (cnt > 0) {
                        build_prices(order_id, cnt);
                        helper.sel_and_label_toggle(add_sel, add_label, false);
                    }
                    else if (cnt == 0) {
                        build_prices(order_id, cnt);
                        helper.sel_and_label_toggle(rem_sel, rem_label, true);
                        helper.sel_and_label_toggle(add_sel, add_label, false);
                    }
                    else {
                        helper.sel_and_label_toggle(rem_sel, rem_label, true);
                        num.value = 0;
                    }
                }

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
            console.log("Build Options Error:" + err);
        }

    }

    function clear_menu(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.lastChild);
        }
    }

    async function build_orders(orders) {
        clear_menu(order_div);
        const helper = await import("./templates.js");
        order_div = document.createElement("div");
        order_div.className = "order-div";

        for (i in orders) {
            const id = orders[i].id;
            const title = orders[i].title;
            const sel_lim = orders[i].selection_limit;
            const br = document.createElement("BR");
            const selection = helper.create_radio_input("title", title, title);

            selection.onclick = () => {
                build_options(id, sel_lim);
            };
            const label = document.createElement("label");
            label.htmlFor = title;
            label.innerHTML = title;

            order_div.append(selection);
            order_div.append(label);
            order_div.append(br);

        }
        menu_items.append(order_div);
    }

    async function build_menu(product) {
        clear_menu(menu_items);
        // console.log(product)
        try {
            const data = await ajax_req({ "product": product }, "/ajax/order")
            build_orders(data.orders);
        }
        catch (err) {
            console.log("Build Menu Error: " + err);
        }
    }
})