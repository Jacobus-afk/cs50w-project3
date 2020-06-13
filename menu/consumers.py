# https://channels.readthedocs.io/en/latest/tutorial/part_2.html
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.group_name = "orders_" + self.scope["user"].username

        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        json_data = json.loads(text_data)
        group_name = "orders_" + json_data["user"]
        # async_to_sync(self.channel_layer.group_send)(
        #     group_name,
        #     {
        #         'type': 'chat_message',
        #         'message': text_data
        #     }
        # )
        self.groups_send(text_data, self.group_name, group_name)

    def groups_send(self, text_data, *groups):
        for group in groups:
            async_to_sync(self.channel_layer.group_send)(
                group, {"type": "chat_message", "message": text_data}
            )

        # self.send(text_data)

    def chat_message(self, event):
        message = event["message"]
        self.send(message)
