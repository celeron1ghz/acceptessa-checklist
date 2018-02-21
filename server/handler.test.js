'use strict';

const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const expect = require('chai').expect;
chai.use(require('chai-as-promised'));

const jwt = require("jsonwebtoken");


function res(code,body) {
  return {
    statusCode: code,
    "headers": {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": undefined,
    },
    body: JSON.stringify(body),
  }
}

describe('/me test', () => {
  const callback = (error, result) => new Promise((resolve, reject) => error ? reject(error) : resolve(result));

  let lambda;
  let proxyDynamoDB;
  let proxySSM;

  beforeEach(() => {
    proxyDynamoDB = class { get(){}  query(){}  put(){}  delete(){} };
    proxySSM     = class { getParameter () {} };

    lambda = proxyquire('./handler', {
      'aws-sdk': {
        DynamoDB: { DocumentClient: proxyDynamoDB },
        SSM: proxySSM,
      },
    });
  });


  it('errors on not specify authorization header', () =>
    expect(lambda.endpoint({ headers: {}}, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(400, { error: "INVALID_HEADER" }) );
    })
  );


  it('errors on invalid authorization header', () =>
    expect(lambda.endpoint({ headers: { Authorization: "piyopiyo" }}, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(400, { error: "INVALID_HEADER" }) );
    })
  );


  it('errors on invalid jwt token', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: 1 } })  });

    return expect(lambda.endpoint({ headers: { Authorization: "Bearer a.a.a" }}, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(401, { error: "INVALID_TOKEN" }) );
    });
  });


  it('errors on dynamodb internal at fetching user info', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: "1" } })  });
    sinon.stub(proxyDynamoDB.prototype, 'get'    ).returns({  promise: () => Promise.reject(new Error("not found"))  });

    const signed = jwt.sign(JSON.stringify({ sessid: 'mogemogefugafuga' }), "1");

    return expect(lambda.endpoint({ headers: { Authorization: "Bearer " + signed }}, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(500, { error: "not found" }) );
    });
  });


  it('errors on user info is not exist', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: "1" } })  });
    sinon.stub(proxyDynamoDB.prototype, 'get'    ).returns({  promise: () => Promise.resolve({ Item: null })  });

    const signed = jwt.sign(JSON.stringify({ sessid: 'mogemogefugafuga' }), "1");

    return expect(lambda.endpoint({ headers: { Authorization: "Bearer " + signed }}, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(401, { error: "EXPIRED" }) );
    });
  });


  it('errors on body is invalid json', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: "1" } })  });
    sinon.stub(proxyDynamoDB.prototype, 'get'    ).returns({  promise: () => Promise.resolve({ Item: {} })  });

    const signed = jwt.sign(JSON.stringify({ sessid: 'mogemogefugafuga' }), "1");

    return expect(lambda.endpoint({ headers: { Authorization: "Bearer " + signed }, body: "destroy!!" }, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(400, { error: "INVALID_BODY" }) );
    });
  });


  it('errors on param "command" not specified', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: "1" } })  });
    sinon.stub(proxyDynamoDB.prototype, 'get'    ).returns({  promise: () => Promise.resolve({ Item: {} })  });

    const signed = jwt.sign(JSON.stringify({ sessid: 'mogemogefugafuga' }), "1");
    const event  = { headers: { Authorization: "Bearer " + signed }, body: JSON.stringify({}) };

    return expect(lambda.endpoint(event, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(400, { error: "INVALID_COMMAND" }) );
    });
  });


  it('errors on invalid "command" param', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: "1" } })  });
    sinon.stub(proxyDynamoDB.prototype, 'get'    ).returns({  promise: () => Promise.resolve({ Item: {} })  });

    const signed = jwt.sign(JSON.stringify({ sessid: 'mogemogefugafuga' }), "1");
    const event  = { headers: { Authorization: "Bearer " + signed }, body: JSON.stringify({ command: "piyopiyo" }) };

    return expect(lambda.endpoint(event, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(400, { error: "INVALID_COMMAND" }) );
    });
  });


  it('errors on command constructor', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: "1" } })  });
    sinon.stub(proxyDynamoDB.prototype, 'get'    ).returns({  promise: () => Promise.resolve({ Item: {} })  });

    const signed = jwt.sign(JSON.stringify({ sessid: 'mogemogefugafuga' }), "1");
    const event  = { headers: { Authorization: "Bearer " + signed }, body: JSON.stringify({ command: "list" }) };

    return expect(lambda.endpoint(event, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(400, { error: "INVALID_PARAM" }) );
    });
  });


  it('ok on list command', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: "1" } })  });
    sinon.stub(proxyDynamoDB.prototype, 'get'    ).returns({  promise: () => Promise.resolve({ Item: {} })  });
    sinon.stub(proxyDynamoDB.prototype, 'query'  ).returns({  promise: () => Promise.resolve({ Items: [1,2,3,4,5] })  });

    const signed = jwt.sign(JSON.stringify({ sessid: 'mogemogefugafuga' }), "1");
    const event  = { headers: { Authorization: "Bearer " + signed }, body: JSON.stringify({ command: "list", exhibition_id: "mogemoge", member_id: "mem" }) };

    return expect(lambda.endpoint(event, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(200, [1,2,3,4,5]) );
    });
  });


  it('ok on add command', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: "1" } })  });
    sinon.stub(proxyDynamoDB.prototype, 'get'    ).returns({  promise: () => Promise.resolve({ Item: {} })  });
    sinon.stub(proxyDynamoDB.prototype, 'put'    ).returns({  promise: () => Promise.resolve({})  });

    const signed = jwt.sign(JSON.stringify({ sessid: 'mogemogefugafuga' }), "1");
    const event  = { headers: { Authorization: "Bearer " + signed }, body: JSON.stringify({ command: "add", circle_id:"aaaaa", exhibition_id: "mogemoge", member_id: "mem" }) };

    return expect(lambda.endpoint(event, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(200, {}) );
    });
  });


  it('ok on remove command', () => {
    sinon.stub(proxySSM.prototype, 'getParameter').returns({  promise: () => Promise.resolve({ Parameter: { Value: "1" } })  });
    sinon.stub(proxyDynamoDB.prototype, 'get'    ).returns({  promise: () => Promise.resolve({ Item: {} })  });
    sinon.stub(proxyDynamoDB.prototype, 'delete' ).returns({  promise: () => Promise.resolve({})  });

    const signed = jwt.sign(JSON.stringify({ sessid: 'mogemogefugafuga' }), "1");
    const event  = { headers: { Authorization: "Bearer " + signed }, body: JSON.stringify({ command: "remove", circle_id:"aaaaa", exhibition_id: "mogemoge", member_id: "mem" }) };

    return expect(lambda.endpoint(event, {}, callback)).to.be.fulfilled.then(result => {
      expect(result).to.deep.equal( res(200, {}) );
    });
  });


  afterEach(() => {
    //proxyDynamoDB.prototype.get.restore();
  });
});