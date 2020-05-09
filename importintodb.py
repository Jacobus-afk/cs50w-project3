import csv
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pizza.settings")
import django
django.setup()
from orders.models import Order, Price, Product
pathlist = []
namelist = []
for file in os.listdir("./pinochio_data"):
    if file.endswith(".csv"):
        pathlist.append(os.path.join("./pinochio_data", file))
        namelist.append(file.split(".")[0])
for entry,name in zip(pathlist, namelist):
    with open(entry) as csvf:
        reader = csv.DictReader(csvf)
        p,_ = Product.objects.get_or_create(product=name)
        for row in reader:
            pass
            #p = Product(product = name)
            
            #p.save()
            o,_ = Order.objects.get_or_create(product = p, title = row["title"], topping_code = row["topping_code"])
            #o.save()
            #print(o)
            if "Normal" in row:
                if row["Normal"]:
                    pr,_ = Price.objects.get_or_create(order = o, price = row["Normal"], size = "NM" )
                    #pr.save()
                    print(pr)
            if "Small" in row:
                if row["Small"]:
                    pr,_ = Price.objects.get_or_create(order = o, price = row["Small"], size = "SM" )
                    #pr.save()
                    print(pr)
            if "Large" in row:
                if row["Large"]:
                    pr,_ = Price.objects.get_or_create(order = o, price = row["Large"], size = "LG" )
                    #pr.save()
                    print(pr)
