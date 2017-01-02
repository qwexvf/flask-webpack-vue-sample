import pytest

from flask_webpack.tests.test_app.app import create_app, index


@pytest.yield_fixture(scope='session')
def app():
    """
    Setup our flask test app, this only gets executed once.

    :return: Flask app
    """
    params = {
        'DEBUG': False,
        'TESTING': True,
        'SERVER_NAME': '192.168.33.10:5000',
        'WEBPACK_ASSETS_URL': 'https://192.168.33.10:2992/assets/'
    }

    _app = create_app(settings_override=params)

    ctx = _app.app_context()
    ctx.push()

    _app.add_url_rule('/', 'index', index)

    yield _app

    ctx.pop()


@pytest.fixture(scope='function')
def client(app):
    """
    Setup an app client, this gets executed for each test function.

    :param app: Pytest fixture
    :return: Flask app client
    """
    return app.test_client()
