# 🚀 CI/CD Pipeline Guide

## Overview

This project uses **GitHub Actions** for continuous integration and deployment. The pipeline includes:

- ✅ **Automated Testing** (Unit, Integration, E2E)
- ✅ **Code Quality Checks** (Linting, Type Checking)
- ✅ **Security Scanning** (Vulnerability scanning)
- ✅ **Docker Image Building** (Multi-stage builds)
- ✅ **Automated Deployment** (Staging & Production)
- ✅ **Notifications** (Slack integration)

## 🔧 Pipeline Jobs

### 1. **Test & Code Quality**
- **Triggers**: Every push and PR
- **Runs**: Linting, Type checking, Unit tests, Coverage
- **Services**: PostgreSQL test database
- **Output**: Test coverage reports

### 2. **Security Scan**
- **Tools**: Trivy vulnerability scanner, npm audit
- **Output**: Security reports in GitHub Security tab
- **Action**: Fails on high/critical vulnerabilities

### 3. **Build Docker Image**
- **Multi-stage**: Development, Build, Production
- **Registry**: GitHub Container Registry (ghcr.io)
- **Caching**: GitHub Actions cache for faster builds
- **Tags**: Branch-based tagging strategy

### 4. **Deploy to Staging**
- **Trigger**: Push to `develop` branch
- **Environment**: Staging environment
- **Health Checks**: Automated health verification

### 5. **Deploy to Production**
- **Trigger**: Push to `main` branch
- **Environment**: Production environment
- **Approval**: Manual approval required
- **Rollback**: Automated rollback on failure

### 6. **Notifications**
- **Success**: Slack notification on successful deployment
- **Failure**: Slack notification on deployment failure
- **Channels**: #deployments channel

## 🚀 Getting Started

### 1. **Setup GitHub Repository**

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit with CI/CD pipeline"

# Add remote repository
git remote add origin https://github.com/your-username/mantrasetu.git
git push -u origin main
```

### 2. **Configure GitHub Secrets**

Go to **Settings > Secrets and variables > Actions** and add:

#### **Required Secrets:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `REDIS_URL`: Redis connection string
- `SLACK_WEBHOOK`: Slack webhook URL for notifications

#### **Optional Secrets:**
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `RAZORPAY_KEY_ID`: Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Razorpay key secret

### 3. **Setup Environments**

Create environments in GitHub:
- **staging**: For develop branch deployments
- **production**: For main branch deployments

### 4. **Configure Branch Protection**

Enable branch protection rules:
- **main**: Require PR reviews, status checks
- **develop**: Require status checks

## 🔄 Workflow Triggers

### **Automatic Triggers:**
- **Push to main**: Deploy to production
- **Push to develop**: Deploy to staging
- **Pull Request**: Run tests and security scans

### **Manual Triggers:**
- **Workflow Dispatch**: Manual deployment
- **Release**: Create release and deploy

## 📊 Monitoring & Alerts

### **Success Metrics:**
- ✅ Build success rate
- ✅ Test coverage percentage
- ✅ Deployment frequency
- ✅ Mean time to recovery (MTTR)

### **Failure Alerts:**
- ❌ Build failures
- ❌ Test failures
- ❌ Security vulnerabilities
- ❌ Deployment failures

## 🛠️ Customization

### **Adding New Jobs:**

```yaml
# Add to .github/workflows/ci-cd.yml
new-job:
  name: New Job
  runs-on: ubuntu-latest
  needs: [test]
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
    - name: Run custom command
      run: echo "Custom job executed"
```

### **Adding New Environments:**

1. Create environment in GitHub
2. Add deployment job in workflow
3. Configure environment-specific secrets

### **Adding New Notifications:**

```yaml
# Add to notify job
- name: Notify Teams
  uses: skitionek/notify-microsoft-teams@master
  with:
    webhook_url: ${{ secrets.TEAMS_WEBHOOK }}
    message: 'Deployment completed!'
```

## 🔒 Security Best Practices

### **Secrets Management:**
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate secrets regularly
- ✅ Use least privilege principle
- ✅ Audit secret usage

### **Container Security:**
- ✅ Use non-root user in containers
- ✅ Scan images for vulnerabilities
- ✅ Use minimal base images
- ✅ Keep dependencies updated

### **Network Security:**
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Use WAF (Web Application Firewall)
- ✅ Monitor network traffic

## 📈 Performance Optimization

### **Build Optimization:**
- ✅ Use Docker layer caching
- ✅ Parallel job execution
- ✅ Optimize Dockerfile layers
- ✅ Use multi-stage builds

### **Deployment Optimization:**
- ✅ Blue-green deployments
- ✅ Rolling updates
- ✅ Health checks
- ✅ Auto-scaling

## 🚨 Troubleshooting

### **Common Issues:**

#### **Build Failures:**
```bash
# Check build logs
gh run list
gh run view <run-id>

# Local testing
docker build -t mantrasetu .
docker run -p 3000:3000 mantrasetu
```

#### **Deployment Failures:**
```bash
# Check deployment status
kubectl get pods -n mantrasetu
kubectl logs -f deployment/mantrasetu-api -n mantrasetu

# Rollback if needed
kubectl rollout undo deployment/mantrasetu-api -n mantrasetu
```

#### **Test Failures:**
```bash
# Run tests locally
npm test
npm run test:cov

# Check test database
docker run --rm postgres:15 psql $DATABASE_URL -c "SELECT 1;"
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Security Best Practices](https://github.com/github/security-policy)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

The CI/CD pipeline will automatically run tests and security scans on your PR!
