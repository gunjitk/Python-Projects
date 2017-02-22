import { FrontendAngularPage } from './app.po';

describe('frontend-angular App', function() {
  let page: FrontendAngularPage;

  beforeEach(() => {
    page = new FrontendAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
