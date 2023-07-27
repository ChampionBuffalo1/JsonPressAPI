import passport from 'passport';
import User from '../models/User';
import { JwtSecret } from '../Constants';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JwtSecret
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ id: jwt_payload.id }, '_id role updatedAt');
      // User object has been changed so the token is no longer valid
      // To tackle the problem where the user has been deleted (or has changed password)
      // and can still use the token to perform actions
      // FIXME: This means updating socials or image for the user also invalidates the token
      if (user?.updatedAt && Date.parse(user.updatedAt.toString()) / 1000 > jwt_payload.iat) return done(null, false);
      if (user) return done(null, user);
    } catch (err) {
      return done(err, false);
    }
    return done(null, false);
  })
);

export default passport;
