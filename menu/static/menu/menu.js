// let products = "";
document.addEventListener("DOMContentLoaded", () => {
    const anchors = document.anchors;
    const menu_items = document.getElementById("menu-items");
    products = JSON.parse(document.getElementById("products_var").textContent);
    // products = JSON.parse(products);
    // console.log(products);
    for (i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', (event) => {
            //console.log(event.currentTarget.name);
            build_menu(event.currentTarget.name);
        });
    }
        
    function clear_menu()
    {
        while (menu_items.firstChild) {
            menu_items.removeChild(menu_items.lastChild);
        }
    }

    function build_menu(product) {
        clear_menu();
        const orders = products[product];

        const element = document.createElement('div');
        element.className = "div-product";

        const iterate = (obj, prev_element) => {
            const element = document.createElement('div');
            element.className = "div-"+obj.legend;
            // console.log(obj.legend);
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
    }

    //console.log("got here");
})