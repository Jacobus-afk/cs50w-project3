import csv
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pizza.settings")
import django

django.setup()
from orders.models import Order, Price, Product, Option, Topping#, ToppingKeeper
from django.apps import apps

pathlist = []
namelist = []
productdict = {}
orderdict = {}


def get_paths(plist):
    pathlist.clear()
    namelist.clear()
    for pathway in plist:
        for file in os.listdir(pathway):
            if file.endswith(".csv"):
                pathlist.append(os.path.join(pathway, file))
                namelist.append(file.split(".")[0])


def populate_products():
    for entry, name in zip(pathlist, namelist):
        model_i_want = apps.get_model(app_label="orders", model_name=name)
        with open(entry) as csvf:
            reader = csv.DictReader(csvf)
            for row in reader:
                try:
                    m, _ = model_i_want.objects.get_or_create(**row)
                    m_dict = m.__dict__
                    productdict[m_dict["product"]] = m_dict["id"]

                except Exception as e:
                    print(e)


def populate_orders():
    for entry in pathlist:
        with open(entry) as csvf:
            reader = csv.DictReader(csvf)
            for row in reader:
                p, _ = Product.objects.get_or_create(product=row["product"])
                #for p in Product.objects.filter(product=row["product"]):
                o, _ = Order.objects.get_or_create(
                    product=p,
                    size_choice=bool(int(row["size_choice"])),
                    selection_limit=int(row["selection_limit"]),
                    title=row["title"],
                )
                o_dict = o.__dict__
                orderdict[o_dict["title"]] = o_dict["id"]


def populate_options():
    for entry, name in zip(pathlist, namelist):
        p, _ = Product.objects.get_or_create(product=name)
        with open(entry) as csvf:
            reader = csv.DictReader(csvf)
            for row in reader:
                for order in Order.objects.filter(product=p):
                    Option.objects.filter(
                        order=order, selection_count=int(row["selection_count"])
                    ).update(option_name=row["option_name"])


def populate_prices():
    for entry in pathlist:
        with open(entry) as csvf:
            reader = csv.DictReader(csvf)
            for row in reader:
                title_id = orderdict[row["title"]]
                sel_cnt = int(row["selection_count"])
                for o in Option.objects.filter(
                    order_id=title_id, selection_count=sel_cnt
                ):
                    if row["Large"]:
                        Price.objects.filter(option=o, size="LG").update(
                            price=float(row["Large"])
                        )
                    if row["Small"]:
                        Price.objects.filter(option=o, size="SM").update(
                            price=float(row["Small"])
                        )
                    if row["Normal"]:
                        Price.objects.filter(option=o, size="NM").update(
                            price=float(row["Normal"])
                        )


def populate_toppings():
    topping_product = {}
    bool_val = False
    for entry in pathlist:
        with open(entry) as csvf:
            reader = csv.DictReader(csvf)
            for key in reader.fieldnames:
                try:
                    prod_obj = Product.objects.get(product=key)
                    topping_product[key] = prod_obj
                except:
                    pass
            for row in reader:
                topping = row["topping"]
                def_choice = bool(int(row["default_choice"]))
                #Pizza = bool(int(row["Pizza"]))
                #Subs = bool(int(row["Subs"]))

                t, _ = Topping.objects.get_or_create(topping=topping, default_choice=def_choice)
                for k,v in topping_product.items():
                    if int(row[k]):
                        #tk, _ = ToppingKeeper.objects.get_or_create(topping=t, product_id=v)
                        t.products.add(v)
if __name__ == "__main__":

    get_paths(
        ["./pinochio_data/product/",]
    )
    populate_products()

    get_paths(
        ["./pinochio_data/topping/",]
    )
    populate_toppings()

    get_paths(
        ["./pinochio_data/order/",]
    )
    populate_orders()

    get_paths(
        ["./pinochio_data/option",]
    )
    populate_options()

    get_paths(
        ["./pinochio_data/price",]
    )
    populate_prices()
