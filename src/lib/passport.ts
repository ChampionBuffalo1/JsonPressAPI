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
      const user = await User.findOne({ id: jwt_payload.id });
      if (user) return done(null, user);
    } catch (err) {
      return done(err, false);
    }
    return done(null, false);
  })
);

export default passport;
