# Generated by Django 2.1.5 on 2020-05-27 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='price',
            name='size',
            field=models.CharField(choices=[('Small', 'Small'), ('Large', 'Large'), ('Standard', 'Standard')], default='Standard', max_length=16),
        ),
    ]