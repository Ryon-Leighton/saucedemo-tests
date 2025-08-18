@login
Feature: SauceDemo Login
  As a user of SauceDemo
  I want to log in with the sample credentials shown on the page
  So that I can access the inventory (or see an appropriate error)

  Background:
    Given I navigate to the login page

  @happy_path @login
  Scenario Outline: Successful login for allowed users
    When I login with "<user>" and password "<password>"
    Then I should be on the inventory page

    Examples:
      | user                    | password     |
      | standard_user           | secret_sauce |
      | problem_user            | secret_sauce |
      | performance_glitch_user | secret_sauce |

  @negative @login
  Scenario: Locked out user shows an error
    When I login with "locked_out_user" and password "secret_sauce"
    Then I should see a login error containing "Sorry, this user has been locked out."

  @validation @login
  Scenario Outline: Invalid login variations
    When I login with "<user>" and password "<password>"
    Then I should see a login error containing "<errorMessage>"

    Examples:
      | user          | password      | errorMessage          |
      |               |               | Username is required  |
      | standard_user |               | Password is required  |
      |               | secret_sauce  | Username is required  |

  @validation @login
  Scenario: Invalid credentials
    When I login with "invalid_user" and password "wrong_password"
    Then I should see a login error containing "Username and password do not match any user in this service"
