"""pact test for AI service client"""

import json
import logging
import os

import pytest
import requests
from requests.auth import HTTPBasicAuth
from pact import Consumer, Like, Provider, Term, Format

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# 全局变量定义
# 契约关系
PACT_CONSUMER = 'CONSUMER'
PACT_PROVIDER = 'PROVIDER'

# Pact Broker服务器信息
PACT_BROKER_HOST ='127.0.0.1'
PACT_BROKER_PORT ='8080'
PACT_BROKER_USERNAME = "pactbroker"
PACT_BROKER_PASSWORD = "pactbroker"
PACT_UPLOAD_URL = "http://" + PACT_BROKER_HOST + ":" + PACT_BROKER_PORT + "/pacts/provider/" + PACT_PROVIDER + "/consumer/"+ PACT_CONSUMER + "/version"

# Pact Mock服务
PACT_MOCK_HOST = 'localhost'
PACT_MOCK_PORT = 1234

# Pact 文件
PACT_DIR = os.path.dirname(os.path.realpath(__file__))
PACT_FILE = (PACT_CONSUMER+'-'+PACT_PROVIDER + '.json').lower()

# 推送到Broker
def push_to_broker(file_name, url, version):
    """TODO: see if we can dynamically learn the pact file name, version, etc."""
    with open(os.path.join(PACT_DIR, file_name), 'rb') as pact_file:
        pact_file_json = json.load(pact_file)

    basic_auth = HTTPBasicAuth(PACT_BROKER_USERNAME, PACT_BROKER_PASSWORD)

    log.info("Uploading pact file to pact broker...")

    r = requests.put(
        "{}/{}".format(url, version),
        auth=basic_auth,
        json=pact_file_json
    )
    if not r.ok:
        log.error("Error uploading: %s", r.content)
        r.raise_for_status()

# 运行项目整个过程只会执行一次
@pytest.fixture(scope='session')
def pact(request):
    # 构造pact对象，定义消费者服务的名字UserServiceClient并给它一个生产者服务UserService
    pact = Consumer(PACT_CONSUMER).has_pact_with(
        Provider(PACT_PROVIDER), host_name=PACT_MOCK_HOST, port=PACT_MOCK_PORT,
        pact_dir=PACT_DIR)
    pact.start_service()
    yield pact
    pact.stop_service()

    version = request.config.getoption('--publish-pact')
    url = PACT_BROKER_HOST + "/pacts/provider/" + PACT_PROVIDER + "/consumer/" + PACT_CONSUMER + "/version"
    if not request.node.testsfailed and version:
        push_to_broker(PACT_FILE, url, version)

def test_post(pact):
    log.error("test_post enter.")
    # 定义响应期望的结果
    expected = {
        "data": {
            "bigModel.promptCount": 10,
            "bigModel.countOfSftTasks": 0,
        },
        "code": 200,
        "msg": "success"
    }

    (pact
     .given('AI大模型开发看板数据接口')
     .upon_receiving('a request for AI大模型开发看板数据接口')
     .with_request('post', '/api/model/data/summary', headers={'TOKEN': '3dd394b1-7d1e-4110-8a10-904dbe112715'})
     .will_respond_with(200, body=Like(expected)))

    with pact:
        base_uri = 'http://{host}:{port}'.format(
            host=PACT_MOCK_HOST, port=PACT_MOCK_PORT)
        uri = base_uri + '/api/model/data/summary'
        headers = {'TOKEN': '3dd394b1-7d1e-4110-8a10-904dbe112715'}
        response = requests.post(uri, headers=headers)
        if not response.ok:
           log.error("test_post fail.")
        log.info("test_post response.json():[%s]", response.json())  