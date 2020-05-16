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
        
    function clear_menu()
    {
        while (menu_items.firstChild) {
            menu_items.removeChild(menu_items.lastChild);
        }
    }

    function build_orders(orders) {
        // console.log(orders)
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
            const label = document.createElement("label");
            label.htmlFor = title;
            label.innerHTML = title;
            

            order_form.append(selection);
            order_form.append(label);
            // console.log(sel_lim);
            if (sel_lim > 0) {
                
                const num = document.createElement("input");
                num.type = "number";
                num.min = 0;
                num.max = sel_lim;
                order_form.append(num);

            } 
            order_form.append(br);

            //console.log(orders[i]);
        }
        order_div.append(order_form);
        menu_items.append(order_div);
    }

    function build_menu(product) {
        clear_menu();
        // console.log(product)

        const request = new XMLHttpRequest();
        request.open("POST", "/ajax/order");
        request.onload = () => {
            const data = JSON.parse(request.responseText);
            build_orders(data.orders);
            // console.log(data);
        }
        const fdata = new FormData();

        fdata.append("product", product);
        fdata.append('csrfmiddlewaretoken', csrftoken);
        request.send(fdata);
        
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