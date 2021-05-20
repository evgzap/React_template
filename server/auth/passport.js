const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    Models = require("../DB/Schema"),
    User = Models.Models.User;

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

passport.use(
    "localLogin",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        (req, email, password, done) => {
            User.findOne({ email: email }, (err, user) => {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(
                        null,
                        false,
                        req.flash("email", "Почта не найдена.")
                    );
                }

                if (!user.validPassword(password)) {
                    return done(
                        null,
                        false,
                        req.flash("password", "Пароль не верен.")
                    );
                }
                return done(null, user);
            });
        }
    )
);
passport.use(
    "localRegister",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        (req, email, password, done) => {
            var DateNow = new Date();
            var shortcut = 0;

            User.find().then((user) => {
                shortcut = user[user.length - 1].shortcut;
                User.findOne(
                    {
                        $or: [
                            { email: email },
                            { username: req.body.username },
                        ],
                    },
                    (err, user) => {
                        if (err) return done(err);
                        if (user) {
                            if (user.email === email) {
                                req.flash("email", "Такая почта уже имеется");
                            }
                            if (user.username === req.body.username) {
                                req.flash(
                                    "username",
                                    "Такой ник уже зарегистрирован"
                                );
                            }

                            return done(null, false);
                        } else {
                            let user = new User();

                            user.email = email;
                            user.password = user.generateHash(password);
                            user.username = req.body.username;
                            user.first_name = req.body.first_name;
                            user.numberPhone = req.body.number;
                            user.image_user_profile = "/images/unknow.png";
                            user.about = "";
                            user.background_user_profile = "#eeeeee";

                            user.subscriber = [];
                            user.follow = [];

                            user.rules =
                                req.body.username == "EVGZAP"
                                    ? "admin"
                                    : "user";

                            user.info.dateRegister =
                                DateNow.getDate() +
                                "." +
                                (DateNow.getMonth() + 1) +
                                "." +
                                DateNow.getFullYear();
                            user.info.age = req.body.age
                                .split("-")
                                .reverse()
                                .join(".");
                            user.info.city = req.body.city;
                            user.info.verified =
                                req.body.username == "EVGZAP" ? true : false;
                            user.info.sex = req.body.sex;

                            user.statusFromOrg = "";
                            user.groups = [];
                            user.shop = [];
                            user.purcashed = [];
                            user.suports = [];
                            user.messagesRoom = [];
                            user.myComments = [];
                            user.post = [];
                            user.categories = [];
                            user.gallery = [];
                            user.status = "default";
                            user.onlineTime = "online";
                            user.ratingGuest = "0";
                            (user.ratingOrg = "0"), (user.eventsOrg = []);
                            user.events = [];
                            user.favorites = [];
                            user.bannedReason = "";
                            (user.banned = false), (user.friends = []);
                            user.shortcut = Number(shortcut) + 1;
                            user.save((err) => {
                                if (err) throw err;
                                return done(null, user);
                            });
                        }
                    }
                );
            });
        }
    )
);

module.exports = passport;