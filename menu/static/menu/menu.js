// https://stackoverflow.com/questions/42733761/how-to-properly-append-django-csrf-token-to-form-in-inline-javascript

document.addEventListener("DOMContentLoaded", () => {
    const anchors = document.anchors;
    const menu_items = document.getElementById("menu-items");
    // products = JSON.parse(document.getElementById("products_var").textContent);

    for (i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', (event) => {
            build_menu(event.currentTarget.name);
        });
    }

    function ajax_req(req_key, req, api_endpoint) {
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
            fdata.append(req_key, req);
            fdata.append('csrfmiddlewaretoken', csrftoken);
            xhr.send(fdata);
        });
    }

    async function build_options(order_title, sel_lim) {
        //console.log("got here - build_options "+ order_title );
        const order_div = document.createElement("div");
        order_div.className = "option-div";
        let topping_count = 0;
        try {
            const data = await ajax_req("order_title", order_title, "/ajax/option");
            console.log(data);
            const options = data.options;
            //const option_name = data.options.option_name;
            //const sel_cnt = data.options.selection_count;
            for (i in options) {
                const option_name = data.options[i].option_name;
                if (option_name.includes("Topping")) {
                    topping_count++;
                }
                if (option_name.includes("Special")) {
                    
                }
            }
            
            menu_items.append(order_div);
        }
        catch (err) {
            console.log("Error:" + err);
        }

    }

    function clear_menu() {
        while (menu_items.firstChild) {
            menu_items.removeChild(menu_items.lastChild);
        }
    }

    function build_orders(orders) {
        const order_div = document.createElement("div");
        order_div.className = "order-div";
        const order_form = document.createElement("form");
        order_form.className = "order-form";
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


            /*order_form*/order_div.append(selection);
            /*order_form*/order_div.append(label);
            
            
            // console.log(sel_lim);
            /*if (sel_lim > 0) {
                
                const num = document.createElement("input");
                num.type = "number";
                num.min = 0;
                num.max = sel_lim;
                order_form.append(num);

            } */
            order_form.append(br);

            //console.log(orders[i]);
        }
        order_div.append(order_form);
        menu_items.append(order_div);
    }

    async function build_menu(product) {
        clear_menu();
        // console.log(product)
        try {
            const data = await ajax_req("product", product, "/ajax/order")
            // console.log(data);
            build_orders(data.orders);
        }
        catch (err) {
            console.log("Error: " + err);
        }




        /*const request = new XMLHttpRequest();
        request.open("POST", "/ajax/order");
        request.onload = () => {
            const data = JSON.parse(request.responseText);
            build_orders(data.orders);
            // console.log(data);
        }
        const fdata = new FormData();

        fdata.append("product", product);
        fdata.append('csrfmiddlewaretoken', csrftoken);
        request.send(fdata);*/

        /*
        const orders = products[product];

        const element = document.createElement('div');
        element.className = "div-product";

        const iterate = (obj, prev_element) => {
            const element = document.createElement('div');
            element.className = "div-"+obj.legend;

            Object.keys(obj).forEach(key => {
                if (key === 'legend') { return; }
                console.log(key)
                const par = document.createElement('p');
                par.innerHTML = key;
                element.append(par);
                if (typeof obj[key] === 'object') {
                    iterate(obj[key], element);
                }
                else {
                    par.innerHTML += " : " + obj[key];
                }
            })
            prev_element.append(element);
        }
        iterate(orders, element);
        menu_items.append(element);
        */
    }
})