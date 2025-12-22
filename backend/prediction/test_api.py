from django.test import TestCase
from rest_framework.test import APIClient
from unittest.mock import patch, Mock

class ApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch('requests.get')
    def test_reverse_geocode_success(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'results': [{'name': 'Test City'}]}
        
        response = self.client.get('/api/reverse-geocode/?latitude=11.0&longitude=77.0')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['name'], 'Test City')

    @patch('requests.get')
    def test_reverse_geocode_timeout(self, mock_get):
        mock_get.side_effect = Exception("Timeout")
        
        response = self.client.get('/api/reverse-geocode/?latitude=11.0&longitude=77.0')
        self.assertEqual(response.status_code, 200)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['results'], [])

    @patch('requests.get')
    def test_reverse_geocode_error(self, mock_get):
        # Simulate an error response without raise_for_status exception
        mock_get.return_value.status_code = 404
        mock_get.return_value.raise_for_status.side_effect = Exception("Not Found")
        
        response = self.client.get('/api/reverse-geocode/?latitude=11.0&longitude=77.0')
        self.assertEqual(response.status_code, 200)
        self.assertIn('error', response.data)
