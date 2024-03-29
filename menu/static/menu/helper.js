export function create_radio_input(name, value, id) {
    // console.log("got here");
    const element = document.createElement("input");
    element.type = "radio";
    element.name = name;
    element.value = value;
    element.id = id;
    element.hidden = true;
    return element;
}

export function create_topping_choices(toppings) {
    const pos = document.getElementById("topping-add-div").getClientRects()[0];
    const popup = document.getElementById("topping-popup");
    // console.log(pos.left);
    popup.style.left = pos.left+"px";
    popup.style.top = pos.top+"px";
    const popup_choices = document.getElementById("topping-choices");
    const popup_close = document.getElementById("topping-close");
    const fullscreen_container = document.getElementById("fullscreen-container");

    fullscreen_container.style.display = "block";
    fullscreen_container.style.opacity = "1";
    popup.style.visibility = "visible";
    while(popup_choices.firstChild) {
        popup_choices.removeChild(popup_choices.lastChild);
    }

    const close_popup = () => {
        popup.style.visibility = "hidden";
        fullscreen_container.style.display = "none";
        fullscreen_container.style.opacity = "100";
    }

    return new Promise((resolve, reject) => {
            
        toppings.map(item => {
            // console.log(item);
            const brk = document.createElement("BR");
            const name = item.topping;
            const anchor = document.createElement("a");
            anchor.href = "#";
            anchor.id = name;
            anchor.innerHTML = name;
    
            popup_choices.append(anchor);
            popup_choices.append(brk);

            anchor.onclick = () => {
                close_popup();
                resolve(item);
            }
        });
        popup_close.onclick = () => {
            close_popup();
            reject("Clicked close");
        };
        fullscreen_container.onclick = () => {
            close_popup();
            reject("Clicked outside popup");
        };
    });

}

export function create_num_input(value, min, max) {
    const num = document.createElement("input");
    num.type = "number";
    num.value = value;
    num.min = min;
    num.max = max;
    return num;
}

export function create_label(htmlfor, innnerhtml) {
    const label = document.createElement("label");
    label.className = "order-label";
    label.htmlFor = htmlfor;
    label.innerHTML = innnerhtml;
    return label;
}

export function sel_and_label_toggle(sel, label, value) {
    sel.disabled = value;
    label.hidden = value;
}

export function appendicitis(parent, ...children) {
    const brk = document.createElement("BR");
    children.map((child) => {
        parent.append(child)
        parent.append(brk);
    });
}

export function incr_cart_cnt() {
    const cart_count = document.getElementById("cart-cnt");
    cart_count.innerHTML = Number(cart_count.innerHTML) + 1;
}

export function decr_cart_cnt() {
    const cart_count = document.getElementById("cart-cnt");
    cart_count.innerHTML = Number(cart_count.innerHTML) - 1;
}

export function ajax_req(req, api_endpoint) {
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
        for (const key in req) {
            // console.log(key);
            fdata.append(key, req[key]);
        }
        fdata.append('csrfmiddlewaretoken', csrftoken);
        xhr.send(fdata);
    });
}