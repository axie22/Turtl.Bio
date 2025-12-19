package auth

import (
	"errors"
	"time"

	"github.com/axie22/turtl/backend/internal/config"
	"github.com/golang-jwt/jwt/v5"
)

type Service struct {
	cfg *config.Config
}

func NewService(cfg *config.Config) *Service {
	return &Service{cfg: cfg}
}

func (s *Service) Login(req LoginRequest) (string, error) {
	if req.User == s.cfg.AuthUser && req.Password == s.cfg.AuthPass {
		// Valid credentials
		claims := jwt.MapClaims{
			"user": req.User,
			"role": "alpha_user",
			"iss":  "turtl-backend",
			"iat":  time.Now().Unix(),
			"exp":  time.Now().Add(7 * 24 * time.Hour).Unix(), // 7 days
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		signedToken, err := token.SignedString([]byte(s.cfg.AuthSecret))
		if err != nil {
			return "", err
		}

		return signedToken, nil
	}

	return "", errors.New("invalid credentials")
}
