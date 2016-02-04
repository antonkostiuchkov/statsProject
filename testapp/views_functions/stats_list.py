import weakref

class Graph(object):
    instances = []

    def __init__(self, id):
        self.id = id
        self.title = 'Graph title'
        self.description = 'Graph description'
        self.type = 'line'
        self.x_axis = 'date'
        self.icon = ''
        self.filters = []
        self.__class__.instances.append(weakref.proxy(self))

    def getName(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'icon': self.icon
        }

# Defining graphs
commands_per_time = Graph(1)
commands_per_time.title = 'Commands executed per time slot'
commands_per_time.description = 'Cmds per time (description)'
commands_per_time.icon = 'fa fa-area-chart'
commands_per_time.filters = ['user', 'device', 'event', 'result_code', 'average_time', 'maximum_time']

commands_per_user = Graph(2)
commands_per_user.title = 'Commands executed per user/user group'
commands_per_user.description = 'Cmds per user/user group (description)'
commands_per_user.type = 'bar'
commands_per_user.x_axis = 'user_name'
commands_per_user.icon = 'fa fa-bar-chart'
commands_per_user.filters = ['user', 'device', 'event', 'result_code']

commands_per_device = Graph(3)
commands_per_device.title = 'Commands executed per device/device group'
commands_per_device.description = 'Cmds per device/device group (description)'
commands_per_device.type = 'column'
commands_per_device.x_axis = 'device_name'
commands_per_device.icon = 'fa fa-column-chart'
commands_per_device.filters = ['user', 'device', 'event', 'result_code']

config_report = Graph(4)
config_report.title = 'Configuration report'
config_report.description = 'Configuration report table (description)'
config_report.type = 'table'
config_report.x_axis = ''
config_report.icon = ''

component_availability = Graph(5)
component_availability.title = 'Component availability per device'
component_availability.description = 'Component availability per device (description)'
component_availability.icon = 'fa fa-area-chart'
component_availability.filters = ['device']





def stats_list_func():
    return {
        'commands_per_time': commands_per_time.getName(),
        'commands_per_user': commands_per_user.getName(),
        'commands_per_device': commands_per_device.getName(),
        'config_report': config_report.getName(),
        'component_availability': component_availability.getName()
    }