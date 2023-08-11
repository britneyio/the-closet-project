from django.test import TestCase
from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase
# Create your tests here.

class EmailVerificationTest(APITestCase):
    #endpoints
    register_url = '/api/v1/users'
    activate_url = '/api/v1/users/activation'
    login_url  = '/api/v1/token/login/'
    user_details_url = '/api/v1/users'

    # user info
    user_data = {
        'email': 'test@example.com',
        'username' : 'test_user',
        'password' : 'verysecret'
    }
    login_data = {
        'email' : 'test@example.com',
        'password': 'verysecret'
    }
    def test_register_with_email_verification(self):
        # register new user
        # parse the verification email
        # activate the account by sending tokena nd uid from the verification email
        # login to get auth_token
        # get user details
        response = self.client.post(self.register_url,self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox),1)

        email_lines = mail.outbox[0].body.splitlines()
        print(mail.outbox[0].subject)
        print(mail.outbox[0].body)

        activation_link = [i for i in email_lines if '/activate/' in i][0]
        uid, token = activation_link.split('/')[-2:]

        data = {'uid' : uid, 'token' : token}
        response = self.client.post(self.activate_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(self.login_url, self.login_data, format='json')
        self.assertTrue('auth_token' in response.json())
        token = response.json()['auth_token']

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        response = self.client.get(self.user_details_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['email'], self.user_data['email'])
        self.assertEqual(response.json()[0]['username'], self.user_data['username'])

    def test_register_resend_verification(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox),1)

        response = self.client.post(self.login_url, self.login_data, format='json')
        self.assertTrue('auth_token' in response.json())
        token = response.json()['auth_token']

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        response = self.client.get(self.user_details_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.credentials()

        data = {'email': self.user_data['email']}
        response = self.client.post(self.resend_verification_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertEqual(len(mail.outbox),2)

        email_lines = mail.outbox[1].body.splitlines()
        activation_link = [i for  i in email_lines if '/activate/' in i][0]
        uid, token = activation_link.split('/')[-2:]

        data = {'uid': uid, 'token': token}
        response = self.client.post(self.activate_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_resend_verification_wrong_email(self):
        response = self.client.post(self.register_url, self.user_data, format='json'
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data = {'email': self.user_data['email'] + '_this_email_is_wrong'}
        response = self.client.post(self.resend_verification_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_activate_with_wrong_uid_token(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data = {'uid': 'wrong-uid', 'token': 'wrong-token'}
        response = self.client.post(self.activate_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)