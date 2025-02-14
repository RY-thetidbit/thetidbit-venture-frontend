'use client';
import React from 'react';
import Image from 'next/image';
import BlogSidebar from '../blog/blog-postox/blog-sidebar';
import BlogPostCommentForm from '../forms/blog-post-comment-form';
import BlogDetailsAuthor from './blog-details-author';
import BlogDetailsComments from './blog-details-comments';
import PostboxDetailsNav from './postbox-details-nav';
import PostboxDetailsTop from './postbox-details-top';
import shape_line from '@assets/img/blog/details/shape/line.png';
import shape_line_2 from '@assets/img/blog/details/shape/quote.png';
import blog_details_big_img from '@assets/img/blog/details/blog-big-1.jpg';
import blog_details_sm_img from '@assets/img/blog/details/blog-details-sm-1.jpg';
import social_data from '@/data/social-data';
import comment_data from '@/data/blog-comment-data';

const BlogDetailsArea = ({ blog }) => {
  return (
    <section className="tp-postbox-details-area pb-120 pt-95">
      <div className="container">
        <div className="row">
          <div className="col-xl-9">
            <PostboxDetailsTop blog={blog} />
          </div>
          <div className="col-xl-12">
            <div className="tp-postbox-details-thumb">
              <Image src={blog_details_big_img} alt="blog-big-img" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <div className="tp-postbox-details-main-wrapper">
              <div className="tp-postbox-details-content">
                <p className="tp-dropcap">
                  A successful sales process is not just about closing deals—it’s about building lasting relationships and trust with your customers. Every interaction should add value and foster loyalty, paving the way for future opportunities.
                </p>
                <p>
                  In today’s fast-paced business environment, transparency and accountability in your sales process can be key differentiators. Empower your team with the right tools and strategies, and watch your business thrive.
                </p>
                <h4 className="tp-postbox-details-heading">
                  Breaking Up With Fast Fashion Has Been Easier
                </h4>
                <p>
                  Consumers are increasingly moving away from fast fashion in favor of sustainable, high-quality alternatives. This shift is driving brands to innovate, offering timeless designs and ethical production practices that appeal to the modern buyer.
                </p>
                <div className="tp-postbox-details-desc-thumb text-center">
                  <Image src={blog_details_sm_img} alt="details-sm-img" />
                  <span className="tp-postbox-details-desc-thumb-caption">
                    Discover how sustainable fashion is reshaping the industry
                  </span>
                </div>
                <p>
                  The rise of conscious consumerism means that brands must adapt to survive. From eco-friendly materials to transparent supply chains, the future of fashion lies in responsible production and thoughtful design.
                </p>
                <div className="tp-postbox-details-quote">
                  <blockquote>
                    <div className="tp-postbox-details-quote-shape">
                      <Image className="tp-postbox-details-quote-shape-1" src={shape_line} alt="shape" />
                      <Image className="tp-postbox-details-quote-shape-2" src={shape_line_2} alt="shape" />
                    </div>
                    <p>
                      There is a way out of every box, a solution to every puzzle—it’s just a matter of finding it.
                    </p>
                    <cite>Shahnewaz Sakil</cite>
                  </blockquote>
                </div>
                <h4 className="tp-postbox-details-heading">
                  Rediscovering Timeless Style Beyond Trends
                </h4>
                <p>
                  Exploring the rich heritage of classic fashion can open up a world of inspiration. By focusing on quality, craftsmanship, and sustainable practices, modern brands are reviving the charm of timeless design.
                </p>
                <div className="tp-postbox-details-list">
                  <ul>
                    <li>Discover sustainable fashion alternatives</li>
                    <li>Invest in quality over quantity</li>
                    <li>Support local artisans and ethical brands</li>
                  </ul>
                </div>
                <p>
                  In conclusion, shifting away from fast fashion isn’t just a trend—it’s a conscious decision to prioritize long-term value, ethical production, and sustainable growth. Every step towards responsible consumption creates a ripple effect that benefits both society and the environment.
                </p>

                {/* Suggestion 1 */}
                <p>
                  <strong>Suggestion 1: Embrace Sustainable Practices.</strong> In today's market, eco-friendly practices are more than just a trend—they're a necessity. Adopting sustainable materials and ethical production processes not only enhances your brand reputation but also attracts environmentally conscious consumers.
                </p>
                <div>
                  <a href="https://cdn.pixabay.com/photo/2016/10/25/12/28/seedlings-1769334_1280.jpg" target="_blank" rel="noopener noreferrer">
                    <Image src="https://cdn.pixabay.com/photo/2016/10/25/12/28/seedlings-1769334_1280.jpg" alt="Sustainable Practices" width={640} height={426} />
                  </a>
                </div>

                {/* Suggestion 2 */}
                <p>
                  <strong>Suggestion 2: Integrate Technology Seamlessly.</strong> Leverage cutting-edge technology to streamline operations and improve the customer experience. Whether it's through AI-driven analytics or smart product features, technology can drive both efficiency and innovation in your business.
                </p>
                <div>
                  <a href="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" target="_blank" rel="noopener noreferrer">
                    <Image src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Technology Integration" width={640} height={427} />
                  </a>
                </div>

                {/* Suggestion 3 */}
                <p>
                  <strong>Suggestion 3: Prioritize Customer Engagement.</strong> Building strong customer relationships is key to long-term success. Invest in personalized marketing strategies and responsive customer service to keep your audience engaged, foster loyalty, and encourage repeat business.
                </p>
                <div>
                  <a href="https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" target="_blank" rel="noopener noreferrer">
                    <Image src="https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Customer Engagement" width={640} height={427} />
                  </a>
                </div>

                {/* Suggestion 4 */}
                <p>
                  <strong>Suggestion 4: Diversify Product Offerings.</strong> Diversification helps mitigate risks and open up new revenue streams. By exploring complementary products or services that align with your core offerings, you create a more resilient and adaptable business model.
                </p>
                <div>
                  <a href="https://cdn.pixabay.com/photo/2015/09/05/21/51/assorted-924123_1280.jpg" target="_blank" rel="noopener noreferrer">
                    <Image src="https://cdn.pixabay.com/photo/2015/09/05/21/51/assorted-924123_1280.jpg" alt="Diversified Products" width={640} height={427} />
                  </a>
                </div>

                {/* Suggestion 5 */}
                <p>
                  <strong>Suggestion 5: Invest in Continuous Improvement.</strong> The market is always evolving, so staying ahead means continually innovating. Regularly review your strategies, gather customer feedback, and invest in training and development to ensure your business remains competitive.
                </p>
                <div>
                  <a href="https://cdn.pixabay.com/photo/2016/11/29/12/54/strategy-1869775_1280.jpg" target="_blank" rel="noopener noreferrer">
                    <Image src="https://cdn.pixabay.com/photo/2016/11/29/12/54/strategy-1869775_1280.jpg" alt="Continuous Improvement" width={640} height={427} />
                  </a>
                </div>

                {/* Conclusion */}
                <p>
                  <strong>Conclusion:</strong> By implementing these strategic suggestions, you can transform your business operations, strengthen customer relationships, and build a sustainable competitive edge. Embracing innovation while staying true to ethical practices will not only enhance your brand's reputation but also secure its future growth in an ever-evolving market.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;
