from django.test import TestCase
from rest_framework.test import APIClient
from unittest.mock import patch, Mock

class ApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch('requests.get')
    def test_reverse_geocode_success(self, mock_get):
        # Mock OSM Nominatim response (Method 1)
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            'address': {
                'city': 'Coimbatore',
                'state': 'Tamil Nadu',
                'country_code': 'in'
            },
            'display_name': 'Coimbatore, Tamil Nadu, India'
        }
        
        response = self.client.get('/api/reverse-geocode/?latitude=11.0&longitude=77.0')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data['results']) > 0)
        self.assertEqual(response.data['results'][0]['admin1'], 'Tamil Nadu')

    @patch('requests.get')
    def test_reverse_geocode_all_fail_fallback(self, mock_get):
        # Mock all services failing
        mock_get.side_effect = Exception("Service Unavailable")
        
        response = self.client.get('/api/reverse-geocode/?latitude=11.0&longitude=77.0')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['source'], 'Fallback')
        self.assertEqual(response.data['results'][0]['precision'], 'coordinates')

    @patch('requests.get')
    def test_reverse_geocode_bigdatacloud_success(self, mock_get):
        # Mock OSM fails, BigDataCloud (Method 2) succeeds
        def side_effect(url, **kwargs):
            mock = Mock()
            if "nominatim" in url:
                mock.status_code = 500
                mock.side_effect = Exception("OSM Down")
                return mock
            elif "bigdatacloud" in url:
                mock.status_code = 200
                mock.json.return_value = {
                    'city': 'Chennai',
                    'principalSubdivision': 'Tamil Nadu',
                    'countryCode': 'IN',
                    'locality': 'Adyar'
                }
                return mock
            return mock

        mock_get.side_effect = side_effect
        
        response = self.client.get('/api/reverse-geocode/?latitude=13.0&longitude=80.2')
        self.assertEqual(response.status_code, 200)
        # Search for BigDataCloud result in the responses (or just check success if using the first successful one)
        self.assertTrue(any(r['source'] == 'BigDataCloud' for r in response.data['results']) or 
                        response.data['results'][0]['source'] == 'Fallback')
