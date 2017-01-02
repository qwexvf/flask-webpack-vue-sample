from flask import Flask, render_template
from werkzeug.serving import run_simple

from flask_webpack import Webpack
webpack = Webpack()


def create_app(settings_override=None):
    """
    Create a test application.

    :param settings_override: Override settings
    :type settings_override: dict
    :return: Flask app
    """
    app = Flask(__name__)

    params = {
        'DEBUG': True,
        'WEBPACK_MANIFEST_PATH': '../dist/manifest.json'
    }

    app.config.update(params)

    if settings_override:
        app.config.update(settings_override)

    webpack.init_app(app)

    return app


app = create_app()


@app.route('/')
def index():
    return render_template('index.jinja2')

if __name__ == '__main__':
    # Change the ip for your enviroment as well
    run_simple('192.168.33.10', 5000, app)
