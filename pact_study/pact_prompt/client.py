import requests


class UserClient(object):
    def __init__(self, base_uri):
        self.base_uri = base_uri

    def get_user(self, user_name):
        """Fetch a user object by user_name from the server."""
        uri = self.base_uri + '/users/' + user_name
        response = requests.get(uri)
        if response.status_code == 404:
            return None
        return response.json()
    def get_user_info(self, user_id, include_details=False):
        """Fetch a user's information by ID from the server."""
        uri = self.base_uri + '/api/users/getInfo'
        payload = {'userId': user_id}
        if include_details:
            payload['includeDetails'] = include_details
        response = requests.post(uri, json=payload)
        return response.json()
