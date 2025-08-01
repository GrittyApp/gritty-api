# 🔧 Setup Guide for API Sync Workflow

This guide will walk you through setting up the automated API synchronization workflow between the `gritty-app` and `gritty-api` repositories.

## 📋 Prerequisites

- Admin access to both `GrittyApp/gritty-app` and `GrittyApp/gritty-api` repositories
- OpenAI API account with access to o3 and GPT-4o models
- GitHub account with appropriate permissions

## 🔑 Step 1: Create GitHub Personal Access Token

### 1.1 Create Token for Cross-Repository Access

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Set the following:
   - **Note**: `Gritty API Sync Workflow`
   - **Expiration**: `No expiration` (or set to your preference)
   - **Scopes**: Select these permissions:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (Upload packages to GitHub Package Registry)
     - ✅ `read:org` (Read org and team membership)

4. Click "Generate token"
5. **IMPORTANT**: Copy the token immediately - you won't see it again!

### 1.2 Alternative: Create Fine-Grained Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Set the following:
   - **Token name**: `Gritty API Sync`
   - **Expiration**: Set to your preference
   - **Resource owner**: `GrittyApp`
   - **Repository access**: Select repositories:
     - ✅ `GrittyApp/gritty-app`
     - ✅ `GrittyApp/gritty-api`
   - **Repository permissions**:
     - ✅ `Actions`: Write
     - ✅ `Contents`: Write
     - ✅ `Issues`: Write
     - ✅ `Metadata`: Read
     - ✅ `Pull requests`: Write

## 🔐 Step 2: Configure Repository Secrets

### 2.1 Add Secrets to gritty-app Repository

1. Go to `https://github.com/GrittyApp/gritty-app/settings/secrets/actions`
2. Click "New repository secret" for each of the following:

#### Required Secrets:

**OPENAI_API_KEY**
```
Value: your-openai-api-key-here
Description: OpenAI API key for o3 and GPT-4o access
```

**GRITTY_API_REPO_TOKEN**
```
Value: your-github-personal-access-token-here
Description: GitHub token for accessing gritty-api repository
```

### 2.2 Add Secrets to gritty-api Repository

1. Go to `https://github.com/GrittyApp/gritty-api/settings/secrets/actions`
2. Add the same secrets:

**OPENAI_API_KEY**
```
Value: your-openai-api-key-here
```

**GRITTY_API_REPO_TOKEN**
```
Value: your-github-personal-access-token-here
```

## 📁 Step 3: Copy Workflow Files

### 3.1 Copy to gritty-app Repository

1. Copy the workflow file to the gritty-app repository:
```bash
# In your gritty-app repository
mkdir -p .github/workflows
cp /path/to/gritty-api/.github/workflows/api-sync.yml .github/workflows/
```

2. Commit and push:
```bash
git add .github/workflows/api-sync.yml
git commit -m "Add API sync workflow"
git push origin main
```

### 3.2 Create Scripts Directory in gritty-api

The workflow will download scripts from the gritty-api repository. We need to create these scripts:

```bash
# In your gritty-api repository
mkdir -p scripts
```

## 🧠 Step 4: Get OpenAI API Key

### 4.1 Create OpenAI Account & Get API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. **IMPORTANT**: Copy the key immediately

### 4.2 Verify Model Access

Make sure your OpenAI account has access to:
- **o3** (for code analysis)
- **GPT-4o** (for code generation)

If you don't have access, you may need to:
- Upgrade your OpenAI plan
- Request access to specific models
- Use alternative models (GPT-4 Turbo as fallback)

## ⚙️ Step 5: Configure Workflow Settings

### 5.1 Update Branch Settings

In the gritty-app repository:

1. Go to Settings → Branches
2. Add branch protection rule for `beta1`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

### 5.2 Configure Reviewers

The workflow is configured to assign PRs to `LukashOleksii`. Make sure:
1. This GitHub username is correct
2. The user has appropriate repository access
3. The user is available for reviews

## 🧪 Step 6: Test the Setup

### 6.1 Manual Test

1. Go to the gritty-app repository
2. Navigate to Actions tab
3. Find "API Documentation Sync" workflow
4. Click "Run workflow"
5. Set "Force update" to `true`
6. Click "Run workflow"

### 6.2 Verify Test Results

The workflow should:
1. ✅ Analyze the current codebase
2. ✅ Generate API changes (if needed)
3. ✅ Create a new branch
4. ✅ Run tests
5. ✅ Create a PR assigned to LukashOleksii

### 6.3 Check for Errors

If the workflow fails:
1. Check the Actions logs for error messages
2. Verify all secrets are set correctly
3. Ensure the OpenAI API key has sufficient credits
4. Check repository permissions

## 🔍 Step 7: Verify Permissions

### 7.1 Repository Access

Verify the GitHub token has access to:
- ✅ Read gritty-app repository
- ✅ Write to gritty-app repository (create branches, PRs)
- ✅ Read gritty-api repository
- ✅ Write to gritty-api repository (update docs)

### 7.2 OpenAI API Access

Test the OpenAI API key:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer your-api-key-here"
```

Should return a list of available models including o3 and GPT-4o.

## 🚨 Troubleshooting

### Common Issues:

**"Permission denied" errors**
- Check GitHub token permissions
- Verify token hasn't expired
- Ensure token has access to both repositories

**"OpenAI API error"**
- Verify API key is correct
- Check OpenAI account has sufficient credits
- Ensure model access (o3, GPT-4o)

**"Workflow not triggering"**
- Check workflow file is in `.github/workflows/` directory
- Verify YAML syntax is correct
- Ensure push is to a monitored branch

**"Scripts not found"**
- Verify scripts exist in gritty-api repository
- Check script download URLs in workflow
- Ensure gritty-api repository is accessible

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all secrets and permissions are configured correctly
3. Test individual components (OpenAI API, GitHub API) separately
4. Review the workflow file for any configuration issues

## ✅ Success Checklist

- [ ] GitHub Personal Access Token created
- [ ] Secrets added to both repositories
- [ ] Workflow file copied to gritty-app
- [ ] OpenAI API key configured and tested
- [ ] Branch protection rules configured
- [ ] Test workflow run completed successfully
- [ ] PR created and assigned to LukashOleksii

Once all items are checked, your automated API sync workflow is ready! 🎉
