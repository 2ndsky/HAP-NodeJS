import zerorpc

class HAP():
    
    def updateValue(self, item, value):
        item = self._sh.return_item(item)
        item(value, "HAP")


self._server = zerorpc.Server(self)
self._server.bind("tcp://0.0.0.0:4243")
self._server.run()

self._client = zerorpc.Client()
self._client.connect("tcp://127.0.0.1:4242")
self._client.init("127.0.0.1", "4243")

for item in self._items:
    self._client.addAccessory(self._items[item].template, self._items[item].values, self._items[item].callbacks)

def parse_item(self, item):
    values = {}
    callbacks = {}

    if "hap_type" not in item.conf:
        return None
    if "hap_name" not in item.conf:
        return None

    values["name"] = item.conf["hap_name"]
    values["item"] = str(item)

    # option 1
    for key in item.conf:
        if key.startswith("hap_v_"):
            values[key[6:]] = item.conf[key]
        elif key.startswith("hap_c_"):
            callbacks[key[6:]] = item.conf[key]

    # option 2
    if "hap_exec" in item.conf:
        callbacks[item.conf["hap_exec"]] = str(item)

    for child in self._sh.find_children(item, "hap_exec"):
        if "hap_type" not in child.conf:
            callbacks[child.conf["hap_exec"]] = str(child)


    self._items[item] = { template: item.conf["hap_type"], values: values, callbacks: callbacks }
    return self.update_item

def update_item(self, item, caller=None, source=None, dest=None):
    if caller != "HAP":
        self._client.updateValue(str(item), item())


# example
[eg]
    [[wohnen]]
        [[[licht]]]
            hap_type = light
            hap_name = Wohnzimmer Deckenlicht
            hap_c_power = eg.wohnen.licht
            hap_c_brightness = eg.wohnen.licht.wert
    
        
