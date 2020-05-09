import csv
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pizza.settings")
import django
django.setup()
from orders.models import Order, Price, Product, Option
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
        #all_fields = model_i_want._meta.get_fields()
        with open(entry) as csvf:
            reader = csv.DictReader(csvf)
            for row in reader:
                try:
                    m,_ = model_i_want.objects.get_or_create(**row)
                    m_dict = m.__dict__
                    productdict[m_dict['product']]=m_dict['id']

                except Exception as e:
                    print(e)
        #model_i_want.objects.get_or_create()

def populate_orders():
    for entry in pathlist:
        with open(entry) as csvf:
            reader = csv.DictReader(csvf)
            for row in reader:
                p,_ = Product.objects.get_or_create(product=row["product"])
                o,_ = Order.objects.get_or_create(product=p, size_choice=bool(int(row["size_choice"])), selection_limit=int(row["selection_limit"]), title=row["title"])
                o_dict = o.__dict__
                orderdict[o_dict['title']]=o_dict['id']

def populate_options():
    for entry, name in zip(pathlist, namelist):
        p,_ = Product.objects.get_or_create(product=name)
        with open(entry) as csvf:
            reader = csv.DictReader(csvf)
            for row in reader:
                for order in Order.objects.filter(product=p):
                    Option.objects.filter(order=order,selection_count=int(row["selection_count"])).update(option_name=row["option_name"])
def populate_prices():
    for entry in pathlist:
        #p,_ = Product.objects.get_or_create(product=name)
        with open(entry) as csvf:
            reader = csv.DictReader(csvf)
            for row in reader:
                #product_id = productdict[row["product"]]
                title_id = orderdict[row["title"]]
                sel_cnt = int(row["selection_count"])
                for o in Option.objects.filter(order_id=title_id, selection_count=sel_cnt):
                    if row["Large"]:
                        Price.objects.filter(option=o,size="LG").update(price=float(row["Large"]))
                    if row["Small"]:
                        Price.objects.filter(option=o,size="SM").update(price=float(row["Small"]))
                    if row["Normal"]:
                        Price.objects.filter(option=o,size="NM").update(price=float(row["Normal"]))

if __name__ == "__main__":
    #pathway = "./pinochio_data/order/"
    #print("am here")
    #from django.core import serializers

    #data = serializers.serialize("json", [Product,Order,Option,Price] )

    get_paths(["./pinochio_data/product/",])#"./pinochio_data/order/"])
    populate_products()
    get_paths(["./pinochio_data/order/",])
    populate_orders()
    get_paths(["./pinochio_data/option",])
    populate_options()
    get_paths(["./pinochio_data/price",])
    populate_prices()
# for entry,name in zip(pathlist, namelist):
#     with open(entry) as csvf:
#         reader = csv.DictReader(csvf)
#         p,_ = Product.objects.get_or_create(product=name)
#         for row in reader:
#             o,_ = Order.objects.get_or_create(product = p, title = row["title"], selection_limit = row["topping_code"])
#             for opt in Option.objects.filter(order=o):
#                 print(opt)

            # if "Normal" in row:
            #     if row["Normal"]:
            #         pr,_ = Price.objects.get_or_create(order = o, price = row["Normal"], size = "NM" )
            #         print(pr)
            # if "Small" in row:
            #     if row["Small"]:
            #         pr,_ = Price.objects.get_or_create(order = o, price = row["Small"], size = "SM" )
            #         print(pr)
            # if "Large" in row:
            #     if row["Large"]:
            #         pr,_ = Price.objects.get_or_create(order = o, price = row["Large"], size = "LG" )
            #         print(pr)
