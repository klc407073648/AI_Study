from django.contrib import admin

from .models import Choice, Question

# 通过 TabularInline （替代 StackedInline ），关联对象以一种表格式的方式展示，显得更加紧凑
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 3  # Choice 对象要在 Question 后台页面编辑。默认提供 3 个足够的选项字段


class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["question_text"]}),
        ("Date information", {"fields": ["pub_date"], "classes": ["collapse"]}),
    ]
    inlines = [ChoiceInline]

    list_display = ["question_text", "pub_date", "was_published_recently"]

    list_filter = ["pub_date"] # 添加了一个“过滤器”侧边栏，允许人们以 pub_date 字段来过滤列表

    search_fields = ["question_text"]

admin.site.register(Question, QuestionAdmin)