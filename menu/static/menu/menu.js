// https://stackoverflow.com/questions/42733761/how-to-properly-append-django-csrf-token-to-form-in-inline-javascript
document.addEventListener("DOMContentLoaded", () => {
    const anchors = document.anchors;
    const menu_items = document.getElementById("menu-items");
    let order_div = document.createElement("div");
    let option_div = document.createElement("div");
    let price_div = document.createElement("div");
    order_div.id = "order-div";
    option_div.id = "option-div";
    price_div.id = "price-div";

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

        const helper = await import("./templates.js");
        let prev_price = undefined;
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
                const size = prices[i].size;
                const price = prices[i].price;
                const id = prices[i].id;

                /*const selection = helper.create_radio_input("price", size, size);
                selection.onclick = () => {
                    place_order(size, id)
                }*/
                const label = helper.create_label(size, size + ": " + price);
                label.onclick = () => {
                    prev_price = update_active_class(prev_price, label);
                    place_order(size, id);
                }
                // helper.appendicitis(price_div, selection, label);
                helper.appendicitis(price_div, label);
            }
            menu_items.append(price_div);
        }
        catch (err) {
            console.log("Build Price Error: " + err);
        }
    }

    async function build_options(order_id, sel_lim) {
        clear_menu(price_div);
        clear_menu(option_div);
        const helper = await import("./templates.js");
        let prev_option = undefined;
        option_div = document.createElement("div");
        option_div.className = "option-div";
        option_div.id = "option-div";
        try {
            const data = await ajax_req({ "order_id": order_id }, "/ajax/option");
            const options = data.options;

            const base_opts = options.filter((option) => {
                return !(option.option_name.includes("Topping"));
            });

            if (base_opts) {
                base_opts.map((opt) => {
                    const option_name = opt.option_name;
                    const cnt = opt.selection_count;
                    if (option_name.includes("Selection(s)")) {
                        //prev_option = update_active_class(prev_option)
                        return build_prices(order_id, cnt);
                    }
                    /*const selection = helper.create_radio_input("option", option_name, option_name);
                    selection.onclick = () => {
                        build_prices(order_id, cnt);
                    };*/
                    const label = helper.create_label(option_name, option_name);
                    label.onclick = () => {
                        prev_option = update_active_class(prev_option, label);
                        build_prices(order_id, cnt);
                    }
                    // helper.appendicitis(option_div, selection, label);
                    helper.appendicitis(option_div, label);
                })
            }
            const topping_lim = options.length - base_opts.length;

            if (topping_lim) {
                const br = document.createElement("BR");
                const num = helper.create_num_input(0, 0, topping_lim);
                num.hidden = true;

                // const add_sel = helper.create_radio_input("option", "Add_Topping", "Add_Topping");
                const add_label = helper.create_label("Add_Topping", "Add Topping");

                // const rem_sel = helper.create_radio_input("option", "Remove_Topping", "Remove_Topping");
                const rem_label = helper.create_label("Remove_Topping", "Remove Topping");
                // helper.sel_and_label_toggle(rem_sel, rem_label, true);
                rem_label.hidden = true;

                // add_sel.onclick = () => {
                add_label.onclick = () => {
                    num.value++;
                    const cnt = num.value;
                    if (cnt < topping_lim) {
                        build_prices(order_id, cnt);
                        // helper.sel_and_label_toggle(rem_sel, rem_label, false);
                        rem_label.hidden = false;
                    }
                    else if (cnt == topping_lim) {
                        build_prices(order_id, cnt);
                        // helper.sel_and_label_toggle(rem_sel, rem_label, false);
                        // helper.sel_and_label_toggle(add_sel, add_label, true);
                        rem_label.hidden = false;
                        add_label.hidden = true;
                    }
                    else {
                        //helper.sel_and_label_toggle(add_sel, add_label, true);
                        add_label.hidden = true;
                        num.value = topping_lim;
                    }
                }

                // rem_sel.onclick = () => {
                rem_label.onclick = () => {
                    num.value--;
                    const cnt = num.value;
                    if (cnt > 0) {
                        build_prices(order_id, cnt);
                        // helper.sel_and_label_toggle(add_sel, add_label, false);
                        add_label.hidden = false;
                    }
                    else if (cnt == 0) {
                        build_prices(order_id, cnt);
                        // helper.sel_and_label_toggle(rem_sel, rem_label, true);
                        // helper.sel_and_label_toggle(add_sel, add_label, false);
                        rem_label.hidden = true;
                        add_label.hidden = false;
                    }
                    else {
                        // helper.sel_and_label_toggle(rem_sel, rem_label, true);
                        rem_label.hidden = true;
                        num.value = 0;
                    }
                }
                helper.appendicitis(option_div, num, add_label, br, rem_label);
                // helper.appendicitis(option_div, num, add_sel, add_label, br, rem_sel, rem_label);
            }

            menu_items.append(option_div);
        }
        catch (err) {
            console.log("Build Options Error:" + err);
        }
    }

    function update_active_class(prev_active, new_active) {
        try {
            prev_active.classList.remove("active-sel");
        }
        catch(err) {
            // console.log("update_active_class error: " + err);
        }
        new_active.classList.add("active-sel");
        return new_active;
    }

    async function build_orders(orders) {
        clear_menu(order_div);
        const helper = await import("./templates.js");
        order_div = document.createElement("div");
        order_div.className = "order-div";
        order_div.id = "order-div";
        let prev_order = undefined;
        orders.map((order) => {
            const id = order.id;
            const title = order.title;
            const sel_lim = order.selection_limit;

            /*const selection = helper.create_radio_input("title", title, title);
            selection.onclick = () => {
                selection.classList.add("active-sel");
                build_options(id, sel_lim);
                if (prev_order) { prev_order.classList.remove("active-sel"); }
                prev_order = selection;
            };*/
            const label = helper.create_label(title, title);
            label.onclick = () => {
                // label.classList.add("active-sel");
                build_options(id, sel_lim);
                prev_order = update_active_class(prev_order, label);
                // if (prev_order) { prev_order.classList.remove("active-sel"); }
                // prev_order = label;
            }
            helper.appendicitis(order_div, label);
            // helper.appendicitis(order_div, selection, label);
        })


        /*for (i in orders) {
            const id = orders[i].id;
            const title = orders[i].title;
            const sel_lim = orders[i].selection_limit;

            const selection = helper.create_radio_input("title", title, title);
            selection.onclick = () => {
                build_options(id, sel_lim);
            };
            const label = helper.create_label(title, title);
            helper.appendicitis(order_div, selection, label);
        }*/
        menu_items.append(order_div);
    }

    function clear_menu(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.lastChild);
        }
        old_elem = document.getElementById(parent.id);
        if ((old_elem) && (old_elem.id != "menu-items")) {
            menu_items.removeChild(old_elem);
        }
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