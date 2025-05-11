### Password Reset Flow Application

## Description
This is a back end server application which is used to reset the password of a user, if the user forgot the login password.

## Model Structure

## User Model
-- email
-- password
-- resetToken
-- resetTokenExpiry

## Objective
-- The main objective of this task is reset the password of a user, if they forgot the old password.
-- So i had given the register, forgot & reset functions only.

## Application details
-- User registration will be completed by the register function which is in the authController.js
-- Forgot password function creates the token to verify the user for generating new password & save the token details in the database also.
-- Reset password function is used to reset the user's password by using the link which will be received to the user's email.
