require('dotenv').config();
let getEventUrl = require('./getEventUrl');

const { fixture } = require('./test-utils');
const mux = require('./mux');
const queries = require('../queries');

// 2015-06-14T22:12:05.275Z
const MockDate = require('mockdate');
MockDate.set(1434319925275);

jest.mock('../lib/mux');
jest.mock('../queries');

describe('getEventUrl', () => {
  it('should return null for non-free event for user with no access', async () => {
    queries.getEvent.mockReturnValue(fixture('queries/getEvent'));

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.price = '$1.00';
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty('url', null);
  });
  it('should return signed url for admin for non-free event', async () => {
    queries.getEvent.mockReturnValue(fixture('queries/getEvent'));

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.price = '$1.00';
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: true };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty(
      'url',
      'https://stream.mux.com/QAgZhucB7Nk9NBIJFhE9a9bjx00ZsVfWuFi1O016KEOJ8.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );
  });
  it('should return signed url for event owner for non-free event', async () => {
    queries.getEvent.mockReturnValue(fixture('queries/getEvent'));

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.price = '$1.00';
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: '9b9f0fa0-8b9c-436b-87e6-6df090a74c76', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty(
      'url',
      'https://stream.mux.com/QAgZhucB7Nk9NBIJFhE9a9bjx00ZsVfWuFi1O016KEOJ8.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );
  });
  it('should return signed url for user with event access', async () => {
    queries.getEvent.mockReturnValue(fixture('queries/getEvent'));

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.price = '$1.00';
    getUserAccessFixture.eventAccess = [{}];
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty(
      'url',
      'https://stream.mux.com/QAgZhucB7Nk9NBIJFhE9a9bjx00ZsVfWuFi1O016KEOJ8.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );
  });
  it('should return signed url for user with account access', async () => {
    queries.getEvent.mockReturnValue(fixture('queries/getEvent'));

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.price = '$1.00';
    getUserAccessFixture.accountAccess = [{}];
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty(
      'url',
      'https://stream.mux.com/QAgZhucB7Nk9NBIJFhE9a9bjx00ZsVfWuFi1O016KEOJ8.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );
  });
  it('live/completed livestream should return signed url', async () => {
    queries.getEvent.mockReturnValue(fixture('queries/getEvent'));
    queries.getUserAccess.mockReturnValue(fixture('queries/getUserAccess'));
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty(
      'url',
      'https://stream.mux.com/QAgZhucB7Nk9NBIJFhE9a9bjx00ZsVfWuFi1O016KEOJ8.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );
  });
  it('returns url when event type is `video` and there is a `mux_asset_id`', async () => {
    queries.getEvent.mockReturnValue(fixture('queries/getEvent'));

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.mux_asset_id = 'a1b2c3';
    getUserAccessFixture.event.type = 'video';
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);

    mux.createPlaybackId.mockReturnValue({ id: 'a1b2c3' });
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty(
      'url',
      'https://stream.mux.com/a1b2c3.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );
  });
  it('returns null when event is `live` and there is no `mux_livestream`', async () => {
    queries.getEvent.mockReturnValue('queries/getEvent');

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.type = 'live';
    getUserAccessFixture.event.mux_livestream = null;
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);

    mux.createPlaybackId.mockReturnValue({ id: 'a1b2c3' });
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty('url', null);
  });
  it('returns null when event is `video` and there is no `mux_asset_id`', async () => {
    queries.getEvent.mockReturnValue('queries/getEvent');

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.type = 'video';
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);

    mux.createPlaybackId.mockReturnValue({ id: 'a1b2c3' });
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty('url', null);
  });
  it('returns null when current date is not in event available window', async () => {
    queries.getEvent.mockReturnValue('queries/getEvent');

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.type = 'video';
    getUserAccessFixture.event.start = '2016-06-14T22:11:12.889+00:00';
    getUserAccessFixture.event.end = '2016-06-14T23:11:12.889+00:00';
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);

    mux.createPlaybackId.mockReturnValue({ id: 'a1b2c3' });
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty('url', null);
  });
  it('returns url when current date is in event available window', async () => {
    queries.getEvent.mockReturnValue('queries/getEvent');

    let getUserAccessFixture = fixture('queries/getUserAccess');
    getUserAccessFixture.event.type = 'video';
    getUserAccessFixture.event.mux_asset_id = 'a1b2c3';
    getUserAccessFixture.event.start = '2013-06-14T22:11:12.889+00:00';
    getUserAccessFixture.event.end = '2020-06-14T23:11:12.889+00:00';
    queries.getUserAccess.mockReturnValue(getUserAccessFixture);

    mux.createPlaybackId.mockReturnValue({ id: 'a1b2c3' });
    mux.createToken.mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );

    let user = { id: 'a1b2c3', isAdmin: false };
    let event_id = '95451df9-d6a1-408b-a252-b95603aaa0fe';
    let res = await getEventUrl({ event_id, user });
    expect(res).toHaveProperty(
      'url',
      'https://stream.mux.com/a1b2c3.m3u8?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGR000Rk9UY1BNYXl1VmVmM1ZoRUlUeHhpc25JajJ3c0prZkk0YmUwMU8wMCJ9.eyJ0aW1lIjoxLCJleHAiOjE2MDk2Nzg1MDEsImF1ZCI6InYiLCJzdWIiOiJRQWdaaHVjQjdOazlOQklKRmhFOWE5Ymp4MDBac1ZmV3VGaTFPMDE2S0VPSjgifQ.aP7LNFQZ5FzPrqHyGQ1mXAx_HQ_eNjySCiG2UsiastL_63JhCvjwrQkhPK837Kp-TvCzSy2iRftWd_5dcd-Q59x_C-QCS_xaSuZjGdWzjUczztz4Z59YnRMUkrem7fBCllFzCJkd9Mm5d3dHIXlaXrTVObaTOABlhmBayvIfe1qAqvPa4nhY3Wsu0WdIrsOqBx-s0HPAbM0qMVTx_FbfkeQX4MTzqjc8BdMl_hN4AAKfuq8Sj6zipCKNqVSpNfXAybZnAODPfOTxlorcTukgd6NxcZuAskARDn2SThALx5VBXlfZkM0120ALOjDVzNgqne7SRAjUZSGx6Eja2EbEIQ'
    );
  });
});
